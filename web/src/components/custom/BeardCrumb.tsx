"use client";
import React from "react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "../ui/breadcrumb";
import { usePathname } from "next/navigation";

const BeardCrumb: React.FC = () => {
  const location = usePathname();
  const pathnames = location.split("/").filter(Boolean);

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {pathnames
            .filter((name) => name !== "pages")
            .map((name, idx, arr) => {
              const filteredPathnames = pathnames.filter((n) => n !== "pages");
              const to = "/" + filteredPathnames.slice(0, idx + 1).join("/");
              const isLast = idx === filteredPathnames.length - 1;
              return (
                <React.Fragment key={to}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>
                        {decodeURIComponent(name)}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={`/pages${to}`}>
                        {decodeURIComponent(name)}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BeardCrumb;
