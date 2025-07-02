<script lang="ts">
  export let open = false;
  export let title = '';
  export let onClose = () => {};
</script>

{#if open}
  <div class="modal-backdrop" tabindex="-1" aria-modal="true" role="dialog">
    <div class="modal">
      <header>
        <h2>{title}</h2>
        <button class="close" on:click={onClose} aria-label="Fermer">&times;</button>
      </header>
      <div class="modal-content">
        <slot />
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: #22223bcc;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal {
    background: #fff;
    border-radius: 1rem;
    box-shadow: 0 2px 16px #0003;
    min-width: 320px;
    max-width: 90vw;
    padding: 2rem;
    position: relative;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .close {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #ef4444;
  }
  .modal-content {
    margin-top: 1rem;
  }
</style> 