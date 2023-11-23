import {ref} from 'vue';

export const template = /*html*/`
  <form @submit="handleSubmit">
    <fieldset class="fieldset">
      <legend>Options</legend>

      <label>
        radius:
        <input type="number" name="radius" v-model="options.radius">
      </label>
      <br>
    </fieldset>
    <fieldset class="fieldset">
      <legend>export</legend>
      <div
        v-for="size in sizeList"
        :key="size"
      >
        <input type="checkbox" :id="'k' + size" name="exportSize" :value="size">

        <label :for="'k' + size">{{size}}px</label>
      </div>
      <label>
        others:
        <input type="text" name="customSize" placeholder="自定义尺寸（多个值使用空格分隔）">
      </label>
    </fieldset>

    <div style="text-align: right;">
      <br>
      <button type="submit" :disabled="!selected"> 导出 </button>
    </div>
  </form>
`;

export default {
  props: ['options', 'selected'],
  setup(props, { emit }) {
    const sizeList = ref([32, 64, 128, 180, 200, 400]);

    function handleSubmit(ev) {
      ev.preventDefault();
      const formData = new FormData(ev.target);
      const radius = formData.get('radius');
      const sizeList = formData.getAll('exportSize');
      const customSize = formData.get('customSize');
      if (customSize.trim()) {
        const csl = customSize.split(' ').filter(v => !Number.isNaN(Number.parseFloat(v)));
        csl.forEach(v => {
          if (!sizeList.includes(v)) {
            sizeList.push(v);
          }
        })
      }
      if (!sizeList?.length) return;
      emit('download', {radius, sizeList});
    }

    return {
      sizeList,
      handleSubmit
    }
  },
  template
}