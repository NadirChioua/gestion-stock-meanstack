<script lang="ts">
  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/carburant', label: 'Carburant', icon: '⛽' },
    { href: '/lavage', label: 'Lavage', icon: '🚗' },
    { href: '/accessoires', label: 'Accessoires', icon: '🧰' },
    { href: '/pneus', label: 'Pneus', icon: '🛞' },
    { href: '/boucherie', label: 'Boucherie', icon: '🥩' },
    { href: '/utilisateurs', label: 'Utilisateurs', icon: '👤' },
    { href: '/statistiques', label: 'Statistiques', icon: '📊' },
    { href: '/restaurant', label: 'Restaurant', icon: '🍽️' },
    { href: '/cafe', label: 'Café', icon: '☕' },
  ];
</script>

<nav class="sidebar">
  <div class="sidebar-logo">
    <img src="/logo.svg" alt="Logo" />
    <span>GSS</span>
  </div>
  <ul>
    {#each links as link}
      <li>
        <a href={link.href} class="sidebar-link">
          <span class="icon">{link.icon}</span>
          <span>{link.label}</span>
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .sidebar {
    min-width: 220px;
    background: #2563eb;
    color: #fff;
    height: 100vh;
    padding: 2rem 1rem 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    position: fixed;
    top: 0; left: 0;
    z-index: 100;
  }
  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }
  .sidebar-logo img {
    width: 40px;
    height: 40px;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .sidebar-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #fff;
    text-decoration: none;
    font-size: 1.1rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    transition: background 0.2s;
  }
  .sidebar-link:hover, .sidebar-link.active {
    background: #1e40af;
  }
  .icon {
    font-size: 1.5rem;
  }
  @media (max-width: 800px) {
    .sidebar {
      min-width: 60px;
      padding: 1rem 0.5rem;
    }
    .sidebar-logo span {
      display: none;
    }
    .sidebar-link span:not(.icon) {
      display: none;
    }
    .icon {
      font-size: 1.7rem;
    }
  }
</style> 