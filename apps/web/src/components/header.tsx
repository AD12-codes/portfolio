import { Link } from '@tanstack/react-router';

import { ModeToggle } from './mode-toggle';
import UserMenu from './user-menu';

export default function Header() {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/service-status', label: 'Service Status' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <div className="flex items-center justify-between py-4">
      <nav className="flex gap-6 text-lg">
        {links.map(({ to, label }) => {
          return (
            <Link
              className="transition-colors hover:text-primary"
              key={to}
              to={to}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <UserMenu />
      </div>
    </div>
  );
}
