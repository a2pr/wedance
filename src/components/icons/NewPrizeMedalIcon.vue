<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 130"
    class="new-prize-medal-icon"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="medalFace" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#fff6cf" />
        <stop offset="55%" stop-color="#f0c419" />
        <stop offset="100%" stop-color="#c8940c" />
      </radialGradient>
      <linearGradient id="medalRibbon" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f6d84a" />
        <stop offset="100%" stop-color="#c8940c" />
      </linearGradient>
    </defs>

    <polygon points="32,72 46,72 46,124 39,111 32,124" fill="url(#medalRibbon)" />
    <polygon points="54,72 68,72 68,124 61,111 54,124" fill="url(#medalRibbon)" />

    <circle cx="50" cy="44" r="39" fill="#c8940c" />
    <circle cx="50" cy="44" r="34" fill="url(#medalFace)" stroke="#e6b91e" stroke-width="2" />

    <text
      x="50"
      y="50"
      text-anchor="middle"
      font-family="Arial, Helvetica, sans-serif"
      font-weight="700"
      font-size="17"
      letter-spacing="1"
      fill="#6b4a00"
    >
      NOVO
    </text>
  </svg>
</template>

<style scoped>
.new-prize-medal-icon {
  width: 2.75rem;
  height: 2.75rem;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.4));
}
</style>
