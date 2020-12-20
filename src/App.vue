<template>
  <v-app>
    <v-card color="primary" flat min-height="10%" tile dark>
      <v-app-bar app dark color="primary" elevation="0">
        <v-row>
          <v-icon>mdi-star-circle</v-icon>
          <div class="ml-2">
            <h2>Skills Banner Generator</h2>
          </div>
          <v-spacer></v-spacer>
          <a href="https://github.com/boukadam/skills-banner-generator">
            <v-icon large>mdi-github</v-icon>
          </a>
        </v-row>
      </v-app-bar>
    </v-card>
    <v-card color="primary" dark flat tile>
      <v-container>
        <v-card-text>
          <v-autocomplete
            v-model="selected"
            :items="skills"
            label="Your skills"
            multiple
            clearable
            chips
            hide-selected
            item-value="files[0]"
            item-text="name"
          >
            <template v-slot:item="data">
              <v-row class="ml-2">
                <img
                  :src="require('./static/logos/' + data.item.files[0])"
                  width="24"
                />
                <span class="pl-2">{{ data.item.name }}</span>
              </v-row>
            </template>
            <template v-slot:selection="data">
              <v-chip close @click:close="onSkillRemoved(data)">
                <span>{{ data.item.name }}</span>
              </v-chip>
            </template>
          </v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-row align="center">
            <v-col cols="4">
              <v-select
                v-model="logoSize"
                :items="logosSizes"
                label="Logo size"
                item-text="title"
                item-value="size"
              ></v-select>
            </v-col>
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              :disabled="generationBeingProcessed || selected.length === 0"
              @click="generate"
              large
            >
              Generate
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-container>
    </v-card>

    <v-container class="mt-6">
      <v-card v-if="generatedImage">
        <v-card-text><v-img :src="generatedImage"></v-img></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="download"> Download as PNG </v-btn>
        </v-card-actions>
      </v-card>
      <canvas id="myCanvas" :width="canvasWidth" :height="canvasHeight" hidden>
        Your browser does not support the HTML5 canvas tag.
      </canvas>
    </v-container>
  </v-app>
</template>

<script>
import json from "./static/logos.json";
export default {
  name: "App",
  components: {},
  data: () => ({
    skills: json,
    logosSizes: [
      {
        title: "Small",
        size: 20 * 4,
      },
      {
        title: "Medium",
        size: 40 * 4,
      },
      {
        title: "Large",
        size: 60 * 4,
      },
    ],
    selected: [],
    canvasWidth: 800 * 4,
    canvasHeight: 200 * 4,
    logoSize: 40 * 4,
    logoMargin: 4 * 4,
    generatedImage: null,
    generationBeingProcessed: false,
  }),
  computed: {
    logoArea() {
      return this.logoSize + 2 * this.logoMargin;
    },
    nbLogoPerRow() {
      return Math.floor(this.canvasWidth / this.logoArea);
    },
    nbLogoPerColumn() {
      return Math.floor(this.canvasHeight / this.logoArea);
    },
  },
  methods: {
    onSkillRemoved(data) {
      data.parent.selectItem(data.item);
    },
    computeCoordinate(index) {
      var x = (index % this.nbLogoPerRow) + 1;
      var y = Math.floor(index / this.nbLogoPerRow) + 1;
      return {
        x: this.canvasWidth - x * this.logoArea,
        y: this.canvasHeight - y * this.logoArea,
      };
    },
    generate() {
      this.generationBeingProcessed = true;

      // Init canvas
      var canvas = document.createElement("canvas");
      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;
      var ctx = canvas.getContext("2d");

      // With gradient background
      var grd = ctx.createRadialGradient(
        0,
        this.canvasWidth / 4,
        5,
        0,
        this.canvasWidth / 4,
        this.canvasHeight / 2
      );
      grd.addColorStop(1, "whitesmoke");
      grd.addColorStop(0, "white");
      ctx.fillStyle = grd;
      ctx.fillRect(10, 10, this.canvasWidth, this.canvasHeight);

      // Append text, is it a good idea ?
      //ctx.font = "small-caps bold 300px Arial"
      //ctx.fillStyle = 'black';
      //ctx.fillText("Skills.", 2 * this.logoMargin, this.canvasHeight - 2 * this.logoMargin);

      // Append selected logos
      var _this = this;
      var drawnLogos = 0;
      this.selected.forEach((element, index) => {
        var image = new Image();
        image.addEventListener("load", function () {
          var height = _this.logoSize;
          var width = _this.logoSize * (this.naturalWidth / this.naturalHeight);
          if (width > _this.logoSize) {
            width = _this.logoSize;
            height = (_this.logoSize * this.naturalHeight) / this.naturalWidth;
          }
          var coordinate = _this.computeCoordinate(index);
          var yShift = 0;
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
      var lnk = document.createElement("a"),
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
