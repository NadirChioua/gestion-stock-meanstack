<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Table from '$lib/components/Table.svelte';
</script>

<h1>Gestion Lavage</h1>
<Button icon="&#43;">Ajouter un ticket</Button>
<Table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Client</th>
      <th>Véhicule</th>
      <th>Service</th>
      <th>Montant</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>2024-07-02</td>
      <td>Ali</td>
      <td>Clio</td>
      <td>Complet</td>
      <td>800</td>
      <td>
        <Button icon="&#9998;" color="secondary">Éditer</Button>
        <Button icon="&#128465;" color="danger">Supprimer</Button>
      </td>
    </tr>
  </tbody>
</Table> 