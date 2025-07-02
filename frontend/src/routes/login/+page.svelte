<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  let email = '';
  let password = '';
  let error = '';

  async function handleLogin() {
    // Appel API backend ici
    // ...
  }
</script>

<div class="login-container">
  <img src="/logo.svg" alt="Logo" class="logo" />
  <form on:submit|preventDefault={handleLogin}>
    <h1>Connexion</h1>
    {#if error}
      <div class="error">{error}</div>
    {/if}
    <input type="email" placeholder="Email" bind:value={email} required autocomplete="username" />
    <input type="password" placeholder="Mot de passe" bind:value={password} required autocomplete="current-password" />
    <Button icon="&#128274;" type="submit">Se connecter</Button>
  </form>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #f4f6fa;
  }
  .logo { width: 80px; margin-bottom: 2rem; }
  form {
    background: #fff;
    padding: 2.5rem 2rem;
    border-radius: 1rem;
    box-shadow: 0 2px 8px #0001;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    min-width: 320px;
    max-width: 90vw;
  }
  input {
    font-size: 1.1rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    outline: none;
  }
  .error { color: #ef4444; }
</style> 