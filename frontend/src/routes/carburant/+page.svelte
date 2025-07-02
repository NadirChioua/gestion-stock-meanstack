<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Table from '$lib/components/Table.svelte';
</script>

<h1>Gestion Carburant</h1>
<Button icon="&#43;">Ajouter une entrée</Button>
<Table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Type</th>
      <th>Quantité (L)</th>
      <th>Prix/L</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <!-- Boucle sur les entrées de carburant ici -->
    <tr>
      <td>2024-07-02</td>
      <td>Essence</td>
      <td>500</td>
      <td>45</td>
      <td>
        <Button icon="&#9998;" color="secondary">Éditer</Button>
        <Button icon="&#128465;" color="danger">Supprimer</Button>
      </td>
    </tr>
  </tbody>
</Table> 