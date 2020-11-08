<template>
  <div>
    <div class="header">
      <slot name="header" />
    </div>
    <div class="main">
      <slot name="main" />
    </div>
    <div class="footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.header {
  height: var(--header-height);
}
</style>
