const fs = require("fs");

const owner = "PEI-HAZARDS";
const repo = "Micro-site";
const token = process.env.GITHUB_TOKEN;

async function getJson(url) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });
  return res.json();
}

(async () => {
  try {
    // Último commit -> dá o total de commits pelo link header?
    const commits = await getJson(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`
    );

    // Issues fechadas
    const issues = await getJson(
      `https://api.github.com/search/issues?q=repo:${owner}/${repo}+type:issue+state:closed`
    );

    // Releases
    const releases = await getJson(
      `https://api.github.com/repos/${owner}/${repo}/releases`
    );

    // JSON final
    const stats = {
      updated_at: new Date().toISOString(),
      commits: commits.length || 0,
      issues_closed: issues.total_count || 0,
      releases: releases.length || 0,
    };

    fs.writeFileSync("stats.json", JSON.stringify(stats, null, 2));
    console.log("✔ stats.json atualizado");
  } catch (error) {
    console.error("Erro ao gerar stats.json:", error);
    process.exit(1);
  }
})();
