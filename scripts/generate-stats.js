const fs = require("fs");

const owner = "PEI-HAZARDS";
const repos = ["IntelligentLogistics", "IntelligentLogistics_APP"];
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

async function getCommitsCount(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  const json = await res.json();
  const link = res.headers.get("link");

  if (link) {
    const match = link.match(/page=(\d+)>; rel="last"/);
    if (match) return parseInt(match[1]);
  }

  return json.length;
}

async function getRepoStats(repo) {
  // commits
  const commits = await getCommitsCount(owner, repo);

  // issues fechadas
  const issues = await getJson(
    `https://api.github.com/search/issues?q=repo:${owner}/${repo}+type:issue+state:closed`
  );

  // releases
  const releases = await getJson(
    `https://api.github.com/repos/${owner}/${repo}/releases`
  );

  return {
    repo,
    commits,
    issues_closed: issues.total_count || 0,
    releases: releases.length || 0,
  };
}

(async () => {
  try {
    const results = [];

    for (const repo of repos) {
      const stats = await getRepoStats(repo);
      results.push(stats);
    }

    // agregados globais
    const totals = results.reduce(
      (acc, r) => {
        acc.commits += r.commits;
        acc.issues_closed += r.issues_closed;
        acc.releases += r.releases;
        return acc;
      },
      { commits: 0, issues_closed: 0, releases: 0 }
    );

    const finalStats = {
      updated_at: new Date().toISOString(),
      repos: results,
      totals,
    };

    fs.writeFileSync("stats.json", JSON.stringify(finalStats, null, 2));
    console.log("✔ stats.json atualizado para múltiplos repositórios");
  } catch (error) {
    console.error("Erro ao gerar stats.json:", error);
    process.exit(1);
  }
})();