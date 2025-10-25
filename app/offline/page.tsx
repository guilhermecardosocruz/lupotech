export default function OfflinePage(){
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginTop: 12, marginBottom: 6 }}>Você está offline</h1>
      <p className="muted">Algumas funcionalidades podem não estar disponíveis sem conexão.</p>
    </main>
  );
}
