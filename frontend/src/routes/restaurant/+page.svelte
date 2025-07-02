<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Table from '$lib/components/Table.svelte';
</script>

<h1>Gestion Restaurant</h1>
<Button icon="&#43;">Ajouter une commande</Button>
<Table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Table</th>
      <th>Serveur</th>
      <th>Total</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>2024-07-02</td>
      <td>5</td>
      <td>Sarah</td>
      <td>3200</td>
      <td>En cours</td>
      <td>
        <Button icon="&#128065;">Voir</Button>
        <Button icon="&#9998;" color="secondary">Éditer</Button>
        <Button icon="&#128465;" color="danger">Supprimer</Button>
      </td>
    </tr>
  </tbody>
</Table> 