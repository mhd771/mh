import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/Topbar";
import { StatsCard } from "@/components/StatsCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatEur, formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [totalProducts, totalListings, profitableProducts, recentAlerts] = await Promise.all([
    prisma.product.count({ where: { userId } }),
    prisma.product.count({ where: { userId, status: "ACTIVE" } }),
    prisma.product.count({ where: { userId, lastProfitEur: { gt: 0 } } }),
    prisma.priceAlert.findMany({
      where: { product: { userId } },
      include: { product: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const avgMargin = await prisma.product.aggregate({
    where: { userId },
    _avg: { lastMarginPct: true },
  });

  const totalProfit = await prisma.product.aggregate({
    where: { userId },
    _sum: { lastProfitEur: true },
  });

  return (
    <>
      <Topbar title="Tableau de bord" />
      <main className="flex-1 space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard label="Produits suivis" value={String(totalProducts)} />
          <StatsCard label="Annonces actives" value={String(totalListings)} />
          <StatsCard
            label="Produits rentables"
            value={String(profitableProducts)}
            tone="positive"
            hint={totalProducts > 0 ? `sur ${totalProducts} produits` : undefined}
          />
          <StatsCard
            label="Marge moyenne"
            value={
              avgMargin._avg.lastMarginPct != null
                ? `${avgMargin._avg.lastMarginPct.toFixed(1)}%`
                : "—"
            }
            tone={
              avgMargin._avg.lastMarginPct != null && avgMargin._avg.lastMarginPct < 0
                ? "negative"
                : "default"
            }
          />
        </div>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-fg">Alertes recentes</h2>
            {recentAlerts.length > 0 && <Badge tone="yellow">{recentAlerts.length} alerte(s)</Badge>}
          </div>

          {recentAlerts.length === 0 ? (
            <p className="text-sm text-fg-muted">
              Aucune alerte pour le moment. Les alertes de marge et de changement de prix
              apparaitront ici.
            </p>
          ) : (
            <ul className="divide-y divide-subtle">
              {recentAlerts.map((alert: (typeof recentAlerts)[number]) => (
                <li key={alert.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-fg">{alert.product.name}</p>
                    <p className="text-sm text-fg-muted">{alert.message}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={alert.type === "NEGATIVE_MARGIN" ? "red" : "yellow"}>
                      {alert.type === "PRICE_CHANGE"
                        ? "Prix"
                        : alert.type === "NEGATIVE_MARGIN"
                        ? "Marge negative"
                        : "Marge faible"}
                    </Badge>
                    <span className="text-xs text-fg-muted">{formatDate(alert.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <p className="text-xs text-fg-muted">
          Estimation totale des marges cumulees: {formatEur(totalProfit._sum.lastProfitEur ?? 0)}
        </p>
      </main>
    </>
  );
}
