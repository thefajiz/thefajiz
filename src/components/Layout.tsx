import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { Cursor } from "./Cursor";
import { Loader } from "./Loader";
//import { MatrixBg } from "./MatrixBg";//

export function Layout({ 
  children, 
  hideNav = false, 
  skipLoader = true,
  onLoaderComplete,
  backgroundAsset
}: { 
  children: React.ReactNode, 
  hideNav?: boolean, 
  skipLoader?: boolean,
  onLoaderComplete?: () => void,
  backgroundAsset?: React.ReactNode
}) {
  return (
    <div className="bg-ink min-h-screen text-ivory relative">
      {backgroundAsset}
      {!skipLoader && <Loader onComplete={onLoaderComplete} />}
      <div className="relative" style={{ zIndex: 1 }}>
        <Cursor />
        <Nav isVisible={!hideNav} />
        <main className="fade-up">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
