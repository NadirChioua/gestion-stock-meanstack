<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  // Ici tu pourras importer des stats, alertes, etc.
</script>

<h1>Tableau de bord</h1>
<div class="dashboard-grid">
  <Card>
    <h2>Revenus du jour</h2>
    <p class="stat">123 000 DA</p>
    <Button icon="&#128065;">Voir détails</Button>
  </Card>
  <Card>
    <h2>Alertes stock</h2>
    <p class="stat">2 produits faibles</p>
    <Button icon="&#9888;">Voir alertes</Button>
  </Card>
  <Card>
    <h2>Ventes carburant</h2>
    <p class="stat">5 000 L</p>
    <Button icon="&#128663;">Voir ventes</Button>
  </Card>
</div>

<style>
  h1 { margin-bottom: 2rem; }
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2rem;
  }
  .stat {
    font-size: 2rem;
    font-weight: bold;
    margin: 1rem 0;
  }
</style> 