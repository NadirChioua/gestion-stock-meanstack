<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Table from '$lib/components/Table.svelte';
</script>

<h1>Gestion Café</h1>
<Button icon="&#43;">Ajouter une vente</Button>
<Table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Produit</th>
      <th>Quantité</th>
      <th>Total</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>2024-07-02</td>
      <td>Café crème</td>
      <td>3</td>
      <td>600</td>
      <td>
        <Button icon="&#9998;" color="secondary">Éditer</Button>
        <Button icon="&#128465;" color="danger">Supprimer</Button>
      </td>
    </tr>
  </tbody>
</Table> 