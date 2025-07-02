<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Table from '$lib/components/Table.svelte';
</script>

<h1>Gestion Utilisateurs</h1>
<Button icon="&#43;">Ajouter un utilisateur</Button>
<Table>
  <thead>
    <tr>
      <th>Nom</th>
      <th>Email</th>
      <th>Rôle</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ahmed</td>
      <td>ahmed@mail.com</td>
      <td>Admin</td>
      <td>
        <Button icon="&#9998;" color="secondary">Éditer</Button>
        <Button icon="&#128465;" color="danger">Supprimer</Button>
      </td>
    </tr>
  </tbody>
</Table> 