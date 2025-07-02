<div class="table-responsive">
  <table class="table">
    <slot />
  </table>
</div>
<style>
  .table-responsive {
    width: 100%;
    overflow-x: auto;
  }
  .table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }
  th {
    background: #f4f6fa;
    font-weight: 700;
  }
  tr:last-child td {
    border-bottom: none;
  }
</style> 