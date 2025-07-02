<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Table from '$lib/components/Table.svelte';
</script>

<h1>Gestion Pneus</h1>
<Button icon="&#43;">Ajouter un pneu</Button>
<Table>
  <thead>
    <tr>
      <th>Marque</th>
      <th>Modèle</th>
      <th>Prix</th>
      <th>Stock</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Michelin</td>
      <td>Energy Saver</td>
      <td>9000</td>
      <td>8</td>
      <td>
        <Button icon="&#9998;" color="secondary">Éditer</Button>
        <Button icon="&#128465;" color="danger">Supprimer</Button>
      </td>
    </tr>
  </tbody>
</Table> 