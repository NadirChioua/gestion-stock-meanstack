<script lang="ts">
  export let type: 'button' | 'submit' = 'button';
  export let color: 'primary' | 'secondary' | 'danger' | 'success' = 'primary';
  export let icon: string = '';
  export let disabled: boolean = false;
</script>

<button class={`btn ${color}`} type={type} disabled={disabled}>
  {#if icon}
    <span class="icon" aria-hidden="true">{@html icon}</span>
  {/if}
  <slot />
</button>

<style>
  .btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    border: none;
    font-family: inherit;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    outline: none;
  }
  .primary { background: #2563eb; color: #fff; }
  .secondary { background: #f59e42; color: #fff; }
  .danger { background: #ef4444; color: #fff; }
  .success { background: #22c55e; color: #fff; }
  .btn:active { opacity: 0.85; }
  .btn:focus { box-shadow: 0 0 0 2px #2563eb55; }
  .icon { display: flex; }
</style> 