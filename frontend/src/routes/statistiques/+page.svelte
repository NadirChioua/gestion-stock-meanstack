<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import Table from '$lib/components/Table.svelte';
</script>

<h1>Statistiques & Rapports</h1>
<div class="stats-grid">
  <Card>
    <h2>Ventes du mois</h2>
    <p class="stat">1 200 000 DA</p>
  </Card>
  <Card>
    <h2>Tickets lavage</h2>
    <p class="stat">320</p>
  </Card>
  <Card>
    <h2>Accessoires vendus</h2>
    <p class="stat">150</p>
  </Card>
</div>
<Table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Module</th>
      <th>Montant</th>
      <th>Détail</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>2024-07-02</td>
      <td>Carburant</td>
      <td>45 000</td>
      <td>Vente essence</td>
    </tr>
  </tbody>
</Table>
<style>
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }
  .stat {
    font-size: 2rem;
    font-weight: bold;
    margin: 1rem 0;
  }
</style> 