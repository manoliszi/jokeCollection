<template>
  <v-btn
    :id="id"
    class="app-btn ma-1"
    :loading="loading"
    :disabled="disabled"
    :color="color"
    :variant="variant"
    :density="density"
    :ripple="label !== '' ? {} : false"
    @click.stop.prevent="btnClick"
  >
    <slot>
      <v-icon v-if="hasIcon" :size="iconSize">{{ icon }}</v-icon>
      <span>
        {{ label }}
      </span>
    </slot>
  </v-btn>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    id: { type: String, default: 'button' },
    label: { type: String, default: '' },
    color: { type: String, default: '' },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    density: { type: String, default: 'default' },
    variant: { type: String, default: 'plain' },
    icon: { type: String, default: '' },
    iconSize: { type: String, default: 'xx-large' }
  });
  const emit = defineEmits(['click']);

  const hasIcon = computed(() => {return props.icon !== ''})

  function btnClick(e) {
    emit('click', e);
  }
</script>
