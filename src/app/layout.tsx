export const metadata = {
  title: 'Visitas',
  description: 'Consultar o Registrar una visita de un establecimiento',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
