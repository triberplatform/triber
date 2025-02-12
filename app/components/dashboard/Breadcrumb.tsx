"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiChevronRight } from 'react-icons/hi';

interface BreadcrumbProps {
  homeElement?: React.ReactNode; // optional custom home element
  separator?: React.ReactNode;  // optional custom separator
  containerClasses?: string;    // optional container classes
  capitalizeLinks?: boolean;    // option to capitalize links
}

const defaultClasses = "flex items-center gap-2 text-sm text-gray-400 mb-4";

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  homeElement = 'Dashboard',
  separator = <HiChevronRight className="text-gray-400" />,
  containerClasses = defaultClasses,
  capitalizeLinks = false,
}) => {
  const pathname = usePathname();
  
  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = () => {
    // Remove any query parameters
    const pathWithoutQuery = pathname.split("?")[0];

    // Split pathname into segments
    const segments = pathWithoutQuery.split("/").filter((segment) => segment !== "");

    // Generate array of breadcrumb items
    return segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const label = capitalizeLinks 
        ? segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
        : segment.replace(/-/g, " ");

      return {
        href,
        label,
        isLast: index === segments.length - 1,
      };
    });
  };

  const breadcrumbs = generateBreadcrumbs();

  // If we're at the root path, don't show breadcrumbs
  if (pathname === "/") return null;

  return (
    <nav aria-label="breadcrumb" className={containerClasses}>
      <ol className="flex items-center gap-2">
        {/* Home element - usually Dashboard */}
        <li>
          <Link 
            href="/dashboard"
            className="hover:text-mainGreen transition-colors"
          >
            {homeElement}
          </Link>
        </li>

        {breadcrumbs.map((breadcrumb) => (
          <React.Fragment key={breadcrumb.href}>
            {/* Separator */}
            {separator}

            {/* Breadcrumb item */}
            <li>
              {breadcrumb.isLast ? (
                // Last item is not clickable
                <span>{breadcrumb.label}</span>
              ) : (
                // Clickable breadcrumb
                <Link
                  href={breadcrumb.href}
                  className="hover:text-mainGreen transition-colors"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;