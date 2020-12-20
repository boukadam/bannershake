<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-icon>mdi-star-circle</v-icon>
      <div class="ml-2">
        <h2>Skills Banner Generator</h2>
      </div>
      <v-spacer></v-spacer>
      <a href="https://github.com/boukadam/skills-banner-generator"
        ><v-icon large>mdi-github</v-icon></a
      >
    </v-app-bar>

    <v-main>
      <v-container>
        <v-card class="mx-lg-auto mt-6 pa-2">
          <v-card-title>
            <h2>Please select your skills</h2>
          </v-card-title>
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
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="generationBeingProcessed"
              @click="generate"
              large
            >
              Generate
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-if="generatedImage" class="mx-lg-auto mt-6">
          <v-card-text><v-img :src="generatedImage"></v-img></v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="download">
              Download as PNG
            </v-btn>
          </v-card-actions>
        </v-card>
        <canvas
          id="myCanvas"
          :width="canvasWidth"
          :height="canvasHeight"
          hidden
        >
          Your browser does not support the HTML5 canvas tag.
        </canvas>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import json from "./static/logos.json";
export default {
  name: "App",
  components: {},
  data: () => ({
    skills: json,
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
