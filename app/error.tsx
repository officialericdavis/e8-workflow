'use client';
export default function GlobalError({ error }: { error: Error }) {
  console.error(error);
  return (
    <html><body style={{minHeight:'100svh',display:'grid',placeItems:'center'}}>
      <div style={{textAlign:'center'}}>
        <h1>Something went wrong</h1>
        <p>Please try again or go back.</p>
      </div>
    </body></html>
  );
}
