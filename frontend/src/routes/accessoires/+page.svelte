<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Table from '$lib/components/Table.svelte';
</script>

<h1>Gestion Accessoires</h1>
<Button icon="&#43;">Ajouter un accessoire</Button>
<Table>
  <thead>
    <tr>
      <th>Nom</th>
      <th>Prix</th>
      <th>Stock</th>
      <th>SKU</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Balai</td>
      <td>300</td>
      <td>12</td>
      <td>ACC-001</td>
      <td>
        <Button icon="&#9998;" color="secondary">Éditer</Button>
        <Button icon="&#128465;" color="danger">Supprimer</Button>
      </td>
    </tr>
  </tbody>
</Table> 