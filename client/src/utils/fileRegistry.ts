type FileRegistry = Map<string, File>;

class FileRegistryManager {
  private registry: FileRegistry = new Map();

  register(id: string, file: File): void {
    this.registry.set(id, file);
  }

  get(id: string): File | undefined {
    return this.registry.get(id);
  }

  getAll(ids: string[]): File[] {
    return ids
      .map(id => this.registry.get(id))
      .filter((f): f is File => f !== undefined);
  }

  unregister(id: string): boolean {
    return this.registry.delete(id);
  }

  clear(): void {
    this.registry.clear();
  }

  size(): number {
    return this.registry.size;
  }
}

export const fileRegistry = new FileRegistryManager();