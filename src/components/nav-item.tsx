import Link from "next/link";

type NavItemProps = {
  href: string;
  title: string;
};

const NavItem = ({ href, title }: NavItemProps) => {
  return (
    <Link
      href={href}
      prefetch
      className="hover:text-blue-600 transition-colors flex items-center justify-center"
    >
      {title}
    </Link>
  );
};

export default NavItem;
