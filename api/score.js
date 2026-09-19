/**
 * Serverless relay for live score data.
 *
 * The Squiggle AFL data API (api.squiggle.com.au) explicitly forbids
 * visitors' browsers fetching it directly — this function fetches
 * server-side instead, on the visitor's behalf, and forwards a
 * simplified result. Vercel's edge cache (Cache-Control below) means
 * all visitors share one upstream request roughly every 30 seconds,
 * rather than each visitor hitting Squiggle individually.
 */
module.exports = async (req, res) => {
  const gameId = parseInt(req.query.gameId, 10);

  if (!Number.isInteger(gameId) || gameId <= 0) {
    res.status(400).json({ error: "Invalid gameId" });
    return;
  }

  try {
    const upstream = await fetch(
      `https://api.squiggle.com.au/?q=games;game=${gameId}`,
      {
        headers: {
          // Squiggle requires a User-Agent identifying the app + contact.
          "User-Agent": "HawkieTime.com fan site - daniel.lasnitzki@gmail.com",
        },
      }
    );

    if (!upstream.ok) {
      res.status(502).json({ error: "Upstream error" });
      return;
    }

    const data = await upstream.json();
    const game = data.games && data.games[0];

    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=30, stale-while-revalidate=30"
    );
    res.status(200).json({
      hteam: game.hteam,
      ateam: game.ateam,
      hscore: game.hscore,
      ascore: game.ascore,
      complete: game.complete,
      timestr: game.timestr,
      winner: game.winner,
      updated: game.updated,
    });
  } catch (err) {
    res.status(502).json({ error: "Failed to fetch score" });
  }
};

