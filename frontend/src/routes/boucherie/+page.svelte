<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Table from '$lib/components/Table.svelte';
</script>

<h1>Gestion Boucherie</h1>
<Button icon="&#43;">Ajouter un produit</Button>
<Table>
  <thead>
    <tr>
      <th>Nom</th>
      <th>Catégorie</th>
      <th>Prix/kg</th>
      <th>Stock (kg)</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Viande hachée</td>
      <td>Boeuf</td>
      <td>1800</td>
      <td>25</td>
      <td>
        <Button icon="&#9998;" color="secondary">Éditer</Button>
        <Button icon="&#128465;" color="danger">Supprimer</Button>
      </td>
    </tr>
  </tbody>
</Table> 