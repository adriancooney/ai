import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
