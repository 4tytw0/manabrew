import { cn } from "@/lib/utils";
import type { CheckpointDto } from "@/protocol/game";
import { PHASES } from "../game.constants";
interface CheckpointsPanelProps {
  checkpoints: CheckpointDto[];
  canRequestRestore: boolean;
  onRequestRestore: (checkpoint: CheckpointDto) => void;
  resolvePlayerName: (playerId: string) => string;
}
const STEP_LABELS = new Map(PHASES.map((phase) => [phase.id, phase.label]));
function groupByTurn(checkpoints: CheckpointDto[]): [number, CheckpointDto[]][] {
  const turns = new Map<number, CheckpointDto[]>();
  for (const checkpoint of checkpoints) {
    turns.set(checkpoint.turn, [...(turns.get(checkpoint.turn) ?? []), checkpoint]);
  }
  return [...turns.entries()].reverse();
}
export function CheckpointsPanel({
  checkpoints,
  canRequestRestore,
  onRequestRestore,
  resolvePlayerName,
}: CheckpointsPanelProps) {
  return (
    <div className="rounded-lg p-2.5 min-h-0 flex-1 flex flex-col bg-muted/20">
      <p className="text-xs font-semibold text-muted-foreground mb-2">Snapshots</p>
      {checkpoints.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">No snapshots yet.</p>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto pr-1 flex flex-col gap-2">
          {groupByTurn(checkpoints).map(([turn, steps]) => (
            <section key={turn} className="rounded-md border border-border/40 p-2">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-foreground">{`Turn ${turn}`}</span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {resolvePlayerName(steps[0]!.activePlayerId)}
                </span>
              </div>
              <ol className="flex flex-col">
                {steps.map((checkpoint) => (
                  <li key={checkpoint.checkpointId}>
                    <button
                      type="button"
                      className={cn(
                        "w-full rounded px-2 py-1 text-left text-xs text-muted-foreground",
                        "enabled:hover:bg-accent enabled:hover:text-accent-foreground",
                        "disabled:opacity-50",
                      )}
                      disabled={!canRequestRestore}
                      onClick={() => onRequestRestore(checkpoint)}
                    >
                      {STEP_LABELS.get(checkpoint.step) ?? checkpoint.step}
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
