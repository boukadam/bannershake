<template>
  <v-app>
    <v-card color="primary" flat tile dark>
      <v-card color="primary" flat tile dark max-width="1024px" class="mx-auto">
        <v-card-title>
          <v-icon>mdi-star-circle</v-icon>
          <h2 class="ml-2">BannerShake</h2>
          <v-spacer></v-spacer>
          <a href="https://github.com/boukadam/bannershake">
            <v-icon x-large>mdi-github</v-icon>
          </a>
        </v-card-title>
        <v-card-text class="mt-6">
          <v-row align="center">
            <span class="ml-2 mb-4 font-weight-light title">
              <strong>BannerShake</strong> is a tool that allows you to generate your own banner from your technical skills.
              <v-dialog v-model="dialog" scrollable max-width="800px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn text v-bind="attrs" v-on="on">
                    How it works?
                  </v-btn>
                </template>
                <v-card max-height="700px">
                  <v-card-title>
                    <span>How it works</span>
                    <v-spacer></v-spacer>
                    <v-icon @click="dialog = false">mdi-close</v-icon>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text class="my-4 font-weight-light title">
                    <p>
                      First, select the skills you want to highlight.
                    </p>
                    <p>
                      Then, choose the background color and then the size of the skills logos (be careful, the number of skills displayed depends
                      on the size you choose).
                    </p>
                    <p>
                      You can even add an image of your choice which will be displayed on the left side of the banner.
                    </p>
                    <p>
                      For example, an old project that I did called <strong>Wafood</strong> was done with
                    </p>
                    <v-img :src="require('./static/examples/wafood-skills-banner.png')" />
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" text x-large @click="dialog = false">Got it!</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </span>
            <span class="ml-2 mb-4 font-weight-light title">
              With <strong>{{ getLogoSizeLabel(logoSize) }}</strong> size you can select up to {{ nbLogoTotal }} skills
              ({{ nbLogoTotal - selected.length }} left)
            </span>
          </v-row>
          <v-autocomplete
              v-model="selected"
              :items="skills"
              :search-input.sync="search"
              label="Select your skills"
              multiple
              clearable
              chips
              hide-selected
              item-value="files[0]"
              item-text="name"
          >
            <template v-slot:item="data">
              <v-row class="ml-2">
                <img :src="require('./static/logos/' + data.item.files[0])" width="24"/>
                <span class="pl-2">{{ data.item.name }}</span>
              </v-row>
            </template>
            <template v-slot:selection="data">
              <v-chip close @click:close="onSkillRemoved(data)">
                <span>{{ data.item.name }}</span>
              </v-chip>
            </template>
          </v-autocomplete>
          <v-row align="center">
            <v-col cols="4">
              <v-text-field v-model="backgroundColor" label="Background color" hide-details readonly class="ma-0 pa-0">
                <template v-slot:append>
                  <v-menu v-model="colorPickerMenu" top nudge-bottom="105" nudge-left="16" :close-on-content-click="false">
                    <template v-slot:activator="{ on }">
                      <div :style="swatchStyle" v-on="on"/>
                    </template>
                    <v-card>
                      <v-card-text class="pa-0">
                        <v-color-picker v-model="backgroundColor" show-swatches flat light/>
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select
                  v-model="logoSize"
                  :items="logosSizes"
                  label="Logo size"
                  item-text="title"
                  item-value="size"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-file-input accept="image/*" label="Brand image" chips @change="setBrandImage"></v-file-input>
            </v-col>
          </v-row>

          <v-row align="center">
            <v-spacer></v-spacer>
            <span v-if="selected.length > nbLogoTotal" class="font-weight-regular title warning--text">Too many logos selected</span>
            <v-col cols="4">
              <v-btn
                  color="success"
                  :disabled="selected.length === 0 || selected.length > nbLogoTotal"
                  @click="generate"
                  x-large
                  block
                  :loading="generationBeingProcessed"
              >
                Generate
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-card>

    <v-card tile height="100%">
      <v-card v-if="generatedImage" max-width="1024px" class="mx-auto my-12">
        <v-card-text>
          <v-img :src="generatedImage"></v-img>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" :disabled="generationBeingProcessed" @click="download" x-large> Download as PNG</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
      <canvas id="myCanvas" :width="canvasWidth" :height="canvasHeight" hidden>
        Your browser does not support the HTML5 canvas tag.
      </canvas>
    </v-card>
    <v-footer padless>
      <v-container class="d-flex justify-space-around">
        <a class="github-button" href="https://github.com/boukadam/bannershake" data-size="large" data-show-count="true"
           aria-label="Star boukadam/skills-banner-generator on GitHub">Star</a>
        <div>{{ new Date().getFullYear() }} - BannerShake</div>
        <a class="github-button" href="https://github.com/boukadam" data-size="large" aria-label="Follow @boukadam on GitHub">Follow @boukadam</a>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import json from "./static/logos.json";

export default {
  name: "App",
  components: {},
  data: () => ({
    search: null,
    skills: json,
    logosSizes: [
      {
        title: "Small",
        size: 25 * 4,
      },
      {
        title: "Medium",
        size: 40 * 4,
      },
      {
        title: "Large",
        size: 55 * 4,
      },
    ],
    selected: [],
    canvasWidth: 800 * 4,
    canvasHeight: 200 * 4,
    logoSize: 40 * 4,
    logoMargin: 4 * 4,
    logosAreaWidth: 800 * 4,
    generatedImage: null,
    generationBeingProcessed: false,
    backgroundColor: "#FFFFEFFF",
    colorPickerMenu: false,
    brandImage: null,
    maxBrandImageWidth: 100 * 4,
    maxBrandImageHeight: 100 * 4,
    dialog: false
  }),
  computed: {
    logoArea() {
      return this.logoSize + 2 * this.logoMargin;
    },
    nbLogoTotal() {
      return this.nbLogoPerColumn * this.nbLogoPerRow;
    },
    nbLogoPerRow() {
      return Math.floor(this.logosAreaWidth / this.logoArea);
    },
    nbLogoPerColumn() {
      return Math.floor(this.canvasHeight / this.logoArea);
    },
    swatchStyle() {
      const {backgroundColor, colorPickerMenu} = this
      return {
        backgroundColor: backgroundColor,
        cursor: 'pointer',
        height: '30px',
        width: '60px',
        borderRadius: colorPickerMenu ? '50%' : '4px',
        border: 'solid',
        borderWidth: 'thin',
        transition: 'border-radius 200ms ease-in-out',
        marginBottom: '4px'
      }
    }
  },
  watch: {
    selected() {
      this.search = null;
    },
  },
  methods: {
    getLogoSizeLabel(size) {
      for (let element of this.logosSizes) {
        if (size === element.size) {
          return element.title;
        }
      }
      return "";
    },
    onSkillRemoved(data) {
      data.parent.selectItem(data.item);
    },
    computeCoordinate(index) {
      let x = (index % this.nbLogoPerRow) + 1;
      let y = Math.floor(index / this.nbLogoPerRow) + 1;
      return {
        x: this.canvasWidth - x * this.logoArea,
        y: this.canvasHeight - y * this.logoArea,
      };
    },
    setBrandImage(file) {
      let reader = new FileReader();
      let _this = this;
      reader.addEventListener("load", function () {
        _this.brandImage = reader.result;
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      }
    },
    generate() {
      this.generationBeingProcessed = true;

      // Init canvas
      let canvas = document.createElement("canvas");
      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;

      // Color the canvas
      let ctx = canvas.getContext("2d");
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      // Append text, is it a good idea ?
      //ctx.font = "small-caps bold 300px Arial"
      //ctx.fillStyle = 'black';
      //ctx.fillText("Skills.", 2 * this.logoMargin, this.canvasHeight - 2 * this.logoMargin);

      // Append brand image
      if (this.brandImage) {
        let brand = new Image;
        let _this = this;
        brand.addEventListener("load", function () {
          let width = this.naturalWidth;
          let height = this.naturalHeight;
          if (this.naturalWidth > _this.maxBrandImageWidth) {
            width = _this.maxBrandImageWidth;
            height = width * (this.naturalHeight / this.naturalWidth);
            if (height > (_this.maxBrandImageHeight)) {
              height = _this.maxBrandImageHeight;
              width = height * (this.naturalWidth / this.naturalHeight);
            }
          } else if (this.naturalHeight > _this.maxBrandImageHeight) {
            height = _this.maxBrandImageHeight;
            width = height * (this.naturalWidth / this.naturalHeight);
            if (width > _this.maxBrandImageWidth) {
              width = _this.maxBrandImageWidth;
              height = width * (this.naturalHeight / this.naturalWidth);
            }
          }
          let x = _this.logoSize;
          let y = (_this.canvasHeight / 2) - (height / 2);
          ctx.drawImage(brand, x, y, width, height);

          let xLine = (2 * x) + width;
          let yLine = _this.canvasHeight / 8;
          ctx.beginPath();
          ctx.moveTo(xLine, yLine);
          ctx.lineTo(xLine, 7 * yLine);
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#616161FF';
          ctx.stroke();

          _this.logosAreaWidth = _this.canvasWidth - xLine;

          _this.generateLogos(canvas);
        });
        brand.src = this.brandImage;
      } else {
        this.generateLogos(canvas);
      }
    },
    generateLogos(canvas) {
      // Append selected logos
      let _this = this;
      let drawnLogos = 0;
      let ctx = canvas.getContext("2d");
      this.selected.forEach((element, index) => {
        let image = new Image();
        image.addEventListener("load", function () {
          let height = _this.logoSize;
          let width = _this.logoSize * (this.naturalWidth / this.naturalHeight);
          if (width > _this.logoSize) {
            width = _this.logoSize;
            height = _this.logoSize * (this.naturalHeight / this.naturalWidth);
          }
          let coordinate = _this.computeCoordinate(index);
          let yShift = 0;
          if (height < _this.logoSize) {
            yShift = (_this.logoSize - height) / 2;
          }
          ctx.drawImage(
              image,
              coordinate.x,
              coordinate.y + yShift,
              width,
              height
          );
          drawnLogos++;
          if (drawnLogos === _this.selected.length) {
            _this.generatedImage = canvas.toDataURL("image/png;base64");
            _this.generationBeingProcessed = false;
          }
        });
        image.src = require("./static/logos/" + element);
      });
    },
    download() {
      let lnk = document.createElement("a"),
          e;

      /// the key here is to set the download attribute of the a tag
      lnk.download = "skills-banner.png";

      /// convert canvas content to data-uri for link. When download
      /// attribute is set the content pointed to by link will be
      /// pushed as "download" in HTML5 capable browsers
      lnk.href = this.generatedImage;

      /// create a "fake" click-event to trigger the download
      if (document.createEvent) {
        e = document.createEvent("MouseEvents");
        e.initMouseEvent(
            "click",
            true,
            true,
            window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null
        );

        lnk.dispatchEvent(e);
      } else if (lnk.fireEvent) {
        lnk.fireEvent("onclick");
      }
    },
  },
};
</script>
