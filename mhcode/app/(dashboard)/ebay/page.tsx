import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { EbayConnectButton } from "@/components/EbayConnectButton";

export default async function EbayPage({
  searchParams,
}: {
  searchParams: { connected?: string; error?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const ebayAccount = await prisma.ebayAccount.findUnique({
    where: { userId: session.user.id },
  });

  const isConfigured = Boolean(process.env.EBAY_CLIENT_ID && process.env.EBAY_CLIENT_SECRET);

  return (
    <>
      <Topbar title="Integration eBay" />
      <main className="flex-1 space-y-6 p-6">
        {searchParams.error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
            Erreur de connexion eBay: {searchParams.error}
          </div>
        )}
        {searchParams.connected && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400">
            Compte eBay connecte avec succes.
          </div>
        )}

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-fg">Statut de connexion</h2>
              <p className="mt-1 text-sm text-fg-muted">
                Connexion via le flux OAuth officiel eBay (developer.ebay.com). Aucune donnee
                n&apos;est simulee.
              </p>
            </div>
            {ebayAccount ? (
              <Badge tone="green">Connecte ({ebayAccount.environment})</Badge>
            ) : (
              <Badge tone="gray">Non connecte</Badge>
            )}
          </div>

          {ebayAccount && (
            <p className="mt-3 text-xs text-fg-muted">
              Connecte depuis le {formatDate(ebayAccount.connectedAt)}
            </p>
          )}

          <div className="mt-5">
            {!isConfigured ? (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-600 dark:text-amber-400">
                <strong>Configuration requise :</strong> EBAY_CLIENT_ID et EBAY_CLIENT_SECRET ne
                sont pas definis dans .env. Cree une application sur{" "}
                <a
                  href="https://developer.ebay.com/my/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  developer.ebay.com
                </a>{" "}
                pour activer cette integration. Sans ces cles, la connexion eBay reste
                volontairement desactivee — aucun contournement n&apos;est effectue.
              </div>
            ) : (
              <EbayConnectButton connected={Boolean(ebayAccount)} />
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-fg">Annonces synchronisees</h2>
          <p className="mt-2 text-sm text-fg-muted">
            Une fois connecte, vos annonces eBay actives apparaitront ici via l&apos;Inventory
            API officielle. Cette section necessite une connexion active pour afficher des
            donnees reelles.
          </p>
        </Card>
      </main>
    </>
  );
}
