import { Link } from "@tanstack/react-router";

/** 未認証時のシンプルなヘッダー */
export default function Header() {
  return (
    <div>
      <div className="flex flex-row items-center justify-between px-4 py-2">
        <Link to="/" className="text-lg font-bold">
          家計簿
        </Link>
      </div>
      <hr />
    </div>
  );
}
