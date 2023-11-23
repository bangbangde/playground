import { ref, reactive } from "vue";
import OptionsForm from './OptionsForm.js';
import CanvasImage from "./CanvasImage.js";
import DialogExport from "./DialogExport.js";
import { toPng } from './svg2png.js';

export const css = /*css*/`
`;

export const template = /*html*/`
  <main class="view-home">
    <div class="canvas-container">
      <CanvasImage
        :size="400"
        :image="image"
        :radius="options.radius"
        ref="canvasCompRef"
      />
    </div>
    <aside>
      <input id="imgInput" style="display: none;" type="file" @change="handleFileSelect" />
      
      <button type="button">
        <label for="imgInput">
          {{ image ? '重新选择' : '选择图片' }}
        </label>
      </button>
      <OptionsForm
        :options="options"
        :selected="!!image"
        @download="handleExport"
      />
    </aside>
    <DialogExport v-model:params="exportParams" />
  </main>
`;

export default {
  components: {
    OptionsForm,
    CanvasImage,
    DialogExport
  },
  setup(props, { expose }) {
    const image = ref(null);
    const canvasCompRef = ref(null);
    const exportParams = ref(null);

    const options = reactive({
      radius: 0
    });

    async function handleFileSelect(ev) {
      const file = ev.target.files[0];
      ev.target.value = null;
      console.log(file);
      if (!file.type.startsWith('image')) {
        alert('你选择的不是图片！');
        return;
      }
      if (file.type === `image/svg+xml`) {
        image.value = await toPng({
          width: 500,
          height: 500,
          svg: URL.createObjectURL(file)
        });
      } else {
        await new Promise(resolve => {
          const img = new Image();
          img.onload = () => {
            image.value = img;
            resolve();
          };
          img.src = URL.createObjectURL(file);
        })
      }

      options.width = image.value.width;
      options.height = image.value.height;
    }

    function handleExport(options) {
      const { sizeList } = options;
      Promise.all(sizeList.map(size => canvasCompRef.value.toBlob(size))).then(res => {
        exportParams.value = res;
      });
    }

    return {
      image,
      canvasCompRef,
      exportParams,
      options,
      handleFileSelect,
      handleExport
    };
  },
  template
}
