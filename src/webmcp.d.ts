// WebMCP type declarations (Chrome 146+ Early Preview)
// Extends HTML form elements with WebMCP declarative attributes

declare namespace React {
  interface FormHTMLAttributes<T> {
    toolname?: string;
    tooldescription?: string;
  }
}

interface ModelContextTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (params: Record<string, unknown>) => Promise<unknown>;
}

interface ModelContext {
  registerTool(tool: ModelContextTool): void;
}

interface Navigator {
  modelContext?: ModelContext;
}
