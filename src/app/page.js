import ShortenForm from "../components/ShortenForm";

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "2rem" }}>
        FastAPI + Next.js URL Shortener
      </h1>
      <ShortenForm />
    </main>
  );
}