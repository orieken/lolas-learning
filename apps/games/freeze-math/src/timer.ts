export class PausableTimer {
  private elapsed = 0; // accumulated elapsed ms while running
  private running = false;
  private paused = false;
  private timeout: any = null;

  constructor(
    private onTick: (elapsedMs: number) => void,
    private intervalMs = 100,
  ) {}

  start() {
    if (this.running) return;
    this.running = true;
    this.paused = false;
    this.schedule();
  }

  private schedule() {
    if (!this.running || this.paused) return;
    this.timeout = setTimeout(() => {
      this.elapsed += this.intervalMs;
      this.onTick(this.elapsed);
      this.schedule();
    }, this.intervalMs);
  }

  pause() {
    if (!this.running || this.paused) return;
    this.paused = true;
    if (this.timeout) clearTimeout(this.timeout);
  }

  resume() {
    if (!this.running || !this.paused) return;
    this.paused = false;
    this.schedule();
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    if (this.timeout) clearTimeout(this.timeout);
  }

  getElapsed() {
    return this.elapsed;
  }
}
