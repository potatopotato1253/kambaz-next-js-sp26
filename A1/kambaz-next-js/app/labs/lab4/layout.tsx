import ReduxProvider from "./ReduxProvider";

export default function Lab4Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReduxProvider>{children}</ReduxProvider>;
}