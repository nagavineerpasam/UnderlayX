import { EditorPanelProvider } from "@/contexts/EditorPanelContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <EditorPanelProvider>{children}</EditorPanelProvider>;
}
