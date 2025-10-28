'use client';

import NextLink from 'next/link';
import { useRouter, usePathname, useSearchParams as useNextSearchParams, useParams as useNextParams } from 'next/navigation';
import { forwardRef, useMemo, useEffect } from 'react';

export const Link = forwardRef(function LinkComponent({ href, to, replace, scroll, shallow, prefetch, children, ...rest }, ref) {
  const linkProps = {
    href: to ?? href ?? '/',
    replace,
    scroll,
    shallow,
    prefetch: prefetch ?? true
  };

  return (
    <NextLink ref={ref} {...linkProps} {...rest}>
      {children}
    </NextLink>
  );
});

export const useNavigate = () => {
  const router = useRouter();

  return (to, options = {}) => {
    if (!to) return;

    if (options.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
};

export const useLocation = () => {
  const pathname = usePathname();
  const searchParams = useNextSearchParams();

  const search = useMemo(() => {
    if (!searchParams) return '';
    const paramsString = searchParams.toString();
    return paramsString.length ? `?${paramsString}` : '';
  }, [searchParams]);

  return {
    pathname: pathname || '/',
    search,
    hash: typeof window !== 'undefined' ? window.location.hash : ''
  };
};

export const useParams = () => {
  return useNextParams();
};

export const useSearchParams = () => {
  const router = useRouter();
  const searchParams = useNextSearchParams();

  const setSearchParams = (nextParams, options = {}) => {
    const current = new URLSearchParams(searchParams?.toString() || '');
    if (typeof nextParams === 'string') {
      // Replace entire query string
      router.push(`${window.location.pathname}?${nextParams}`, { scroll: options.scroll ?? false });
      return;
    }

    if (nextParams instanceof URLSearchParams) {
      router.push(`${window.location.pathname}?${nextParams.toString()}`, { scroll: options.scroll ?? false });
      return;
    }

    Object.entries(nextParams || {}).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    const queryString = current.toString();
    router.push(`${window.location.pathname}${queryString ? `?${queryString}` : ''}`, { scroll: options.scroll ?? false });
  };

  return [searchParams, setSearchParams];
};

export const Navigate = ({ to, replace = false }) => {
  const router = useRouter();

  useEffect(() => {
    if (!to) return;
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);

  return null;
};

export const Outlet = ({ children }) => {
  return children ?? null;
};

export const BrowserRouter = ({ children }) => children;
export const Routes = ({ children }) => children;
export const Route = ({ element }) => element ?? null;
