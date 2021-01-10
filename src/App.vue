<template>
  <v-app>
    <v-card color="indigo" flat tile dark>
      <v-card color="indigo" flat tile dark max-width="1024px" class="mx-auto">
        <v-card-title>
          <v-img :src="require('./assets/logo-white.png')" :max-width="$vuetify.breakpoint.xs ? 28 : 40"/>
          <span class="ml-2 text-md-h4 text-sm-h5 font-weight-bold">BannerShake</span>
          <v-spacer></v-spacer>
          <v-menu left offset-y>
            <template v-slot:activator="{ attrs, on }">
              <v-btn class="white--text" v-bind="attrs" v-on="on" text :small="$vuetify.breakpoint.xs">
                {{ $i18n.locale }} &#x25BC;
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="locale in getSupportedLocales" :key="locale.code" @click="$i18n.locale = locale.code">
                <v-list-item-icon class="mr-4">
                  <country-flag :country="locale.flag" size="small" />
                </v-list-item-icon>
                <v-list-item-title>{{ locale.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-menu offset-y close-on-content-click left max-width="300px">
            <template v-slot:activator="{ attrs, on }">
              <v-btn v-bind="attrs" v-on="on" icon>
                <v-icon :large="!$vuetify.breakpoint.xs">mdi-help-circle</v-icon>
              </v-btn>
            </template>
            <v-list class="body-2" rounded>
              <v-list-item href="https://github.com/boukadam/bannershake">
                <v-list-item-icon>
                  <v-icon color="indigo">mdi-github</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ $t('lastUpdate') }}</v-list-item-title>
                  <span class="grey--text text--darken-2 font-italic mt-1">{{ lastCommitMessage }} </span>
                  <small v-if="lastUpdate" class="font-weight-light">{{ lastUpdate }}</small>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item @click="howItWorksDialog = true">
                <v-list-item-icon>
                  <v-icon color="indigo">mdi-information</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ $t('howItWorks.title') }}</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item @click="feedbackDialog = true">
                <v-list-item-icon>
                  <v-icon color="indigo">mdi-lightbulb-on</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ $t('feedback.title') }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card-title>

        <v-dialog v-model="feedbackDialog" scrollable max-width="800px" :fullscreen="$vuetify.breakpoint.xs">
          <v-card max-height="700px">
            <v-card-title>
              <span>{{ $t('feedback.title') }}</span>
              <v-spacer></v-spacer>
              <v-icon @click="feedbackDialog = false">mdi-close</v-icon>
            </v-card-title>
            <v-divider></v-divider>
            <v-form ref="form">
              <v-card-text class="my-4 font-weight-light text-md-h5 text-h6 text-justify">
                <span v-html="$t('feedback.text')"></span>
                <v-text-field v-model="feedbackEmail" :label="$t('feedback.emailField')" append-icon="mdi-email"></v-text-field>
                <v-textarea
                    v-model="feedbackComment"
                    :label="$t('feedback.commentField')"
                    auto-grow
                    rows="1"
                    append-icon="mdi-comment"
                    :rules="[value => !!value || t('feedback.requiredField')]"
                ></v-textarea>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" text x-large @click="postFeedback" :loading="feedbackSubmitLoading">{{ $t('feedback.send') }}</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
        <v-dialog v-model="howItWorksDialog" scrollable max-width="800px" :fullscreen="$vuetify.breakpoint.xs">
          <v-card max-height="700px">
            <v-card-title>
              <span>{{ $t('howItWorks.title') }}</span>
              <v-spacer></v-spacer>
              <v-icon @click="howItWorksDialog = false">mdi-close</v-icon>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="my-4 font-weight-light title text-justify">
              <p>
                {{ $t('howItWorks.step1') }}
              </p>
              <p>
                {{ $t('howItWorks.step2') }}
              </p>
              <p>
                {{ $t('howItWorks.step3') }}
              </p>
              <p>
                {{ $t('howItWorks.example1') }}
              </p>
              <p>
                <v-img :src="require('./static/examples/wafood-skills-banner.png')"/>
              </p>
              <p>
                {{ $t('howItWorks.example2') }}
              </p>
              <v-img :src="require('./static/examples/boukadam-banner.png')"/>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success" text x-large @click="howItWorksDialog = false">{{ $t('howItWorks.gotIt') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-card-text class="mt-6">
          <v-row align="center">
            <span class="ml-2 mb-4 font-weight-light text-justify text-md-h5 text-h6">
              <span v-html="$t('bannerShakeDesc')"></span>
            </span>
            <span
                class="ml-2 mb-4 font-weight-light text-justify text-md-h5 text-h6"
                v-html="$t('nbLogosAlert', {size: getLogoSizeLabel(logoSize), nbLogoTotal: nbLogoTotal, nbLogoLeft: nbLogoTotal - selected.length})"
            >
            </span>
          </v-row>
          <v-row class="px-3">
            <v-autocomplete
                v-model="selected"
                :items="skills"
                :search-input.sync="search"
                :label="$t('selectSkills')"
                multiple
                clearable
                chips
                hide-selected
                item-value="icon"
                item-text="name"
            >
              <template v-slot:item="data">
                <v-row class="ml-2" align="center">
                  <img :src="require('./static/' + data.item.icon)" width="24"/>
                  <span class="pl-2">{{ data.item.name }}</span>
                </v-row>
              </template>
              <template v-slot:selection="data">
                <v-chip close @click:close="onSkillRemoved(data)">
                  <span>{{ data.item.name }}</span>
                </v-chip>
              </template>
            </v-autocomplete>
          </v-row>
          <v-row align="center" justify="center">
            <v-col :cols="$vuetify.breakpoint.xs ? 12 : 4" class="py-0">
              <v-file-input accept="image/*" :label="$t('brandImage')" chips @change="setBrandImage"></v-file-input>
            </v-col>
            <v-col :cols="$vuetify.breakpoint.xs ? 12 : 4">
              <v-select
                  v-model="logoSize"
                  :items="logoSizes"
                  :label="$t('logoSize')"
                  item-text="title"
                  item-value="size"
              ></v-select>
            </v-col>
            <v-col :cols="$vuetify.breakpoint.xs ? 12 : 4" :class="$vuetify.breakpoint.xs ? 'pb-0' : 'pb-5'">
              <v-text-field v-model="backgroundColor" :label="$t('backgroundColor')" hide-details readonly class="ma-0 pa-0">
                <template v-slot:append>
                  <v-menu v-model="colorPickerMenu" top nudge-bottom="105" nudge-left="16" :close-on-content-click="false">
                    <template v-slot:activator="{ on }">
                      <div :style="swatchStyle" v-on="on"/>
                    </template>
                    <v-card>
                      <v-card-text class="pa-0">
                        <v-color-picker v-model="backgroundColor" show-swatches flat light/>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="success" text large @click="colorPickerMenu = false">{{ $t('close') }}</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <v-row align="center">
            <v-col :cols="$vuetify.breakpoint.xs ? 12 : 8">
              <span v-if="selected.length > nbLogoTotal" class="font-weight-regular title warning--text">{{ $t('tooManySkillsAlert') }}</span>
            </v-col>
            <v-col :cols="$vuetify.breakpoint.xs ? 12 : 4">
              <v-btn
                  color="success"
                  :disabled="selected.length === 0 || selected.length > nbLogoTotal"
                  @click="generate"
                  :x-large="!$vuetify.breakpoint.xs"
                  block
                  :loading="generationBeingProcessed"
              >
                {{ $t('generate') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="5000">{{ snackbarText }}</v-snackbar>
    <v-card tile height="100%">
      <v-card v-if="generatedImage" max-width="1024px" class="mx-auto my-12" tile color="#FAFAFAFF">
        <v-card-text>
          <v-img :src="generatedImage"></v-img>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="success"
              :loading="generationBeingProcessed"
              @click="download"
              :x-large="!$vuetify.breakpoint.xs"
          >
            {{ $t('download') }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
      <canvas id="myCanvas" :width="canvasWidth" :height="canvasHeight" hidden>
        {{ $t('html5CanvasUnsupportedErrorMsg') }}
      </canvas>
    </v-card>
    <v-footer padless>
      <v-container class="d-flex justify-space-between" style="max-width: 1024px">
        <div>
          <a class="github-button" href="https://github.com/boukadam/bannershake" data-size="large" data-show-count="true"
             aria-label="Star boukadam/skills-banner-generator on GitHub"> Star </a>
        </div>
        <div v-if="!$vuetify.breakpoint.xs" class="mx-12">
          <v-row align="center">{{ new Date().getFullYear() }} -
            <v-img :src="require('./assets/logo-black.png')" max-width="24" class="mx-1"/>
            BannerShake
          </v-row>
        </div>
        <div>
          <a class="github-button" href="https://github.com/boukadam" data-size="large" aria-label="Follow @boukadam on GitHub">
            Follow @boukadam
          </a>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import json from "./static/provided/providedLogos.json";
import supportedLocales from "./locales"
import moment from "moment";

export default {
  name: "App",
  metaInfo: {
    title: "BannerShake - Skills Banner Generator"
  },
  components: {},
  data: () => ({
    search: null,
    skills: json,
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
    howItWorksDialog: false,
    lastUpdate: null,
    lastCommitMessage: null,
    feedbackDialog: false,
    feedbackEmail: null,
    feedbackComment: null,
    feedbackSubmitLoading: false,
    snackbar: false,
    snackbarText: ""
  }),
  mounted() {
    fetch("https://api.github.com/repos/boukadam/bannershake/commits/main")
        .then(response => response.json())
        .then(response => {
          this.lastUpdate = moment(response.commit.committer.date).fromNow();
          this.lastCommitMessage = response.commit.message;
        });
  },
  computed: {
    getSupportedLocales() {
      return supportedLocales;
    },
    logoSizes() {
      return [
        {
          title: this.$t('smallLogoSize'),
          size: 25 * 4,
        },
        {
          title: this.$t('mediumLogoSize'),
          size: 40 * 4,
        },
        {
          title: this.$t('largeLogoSize'),
          size: 55 * 4,
        },
      ]
    },
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
    feedbackDialog() {
      this.$refs.form.reset()
    }
  },
  methods: {
    getLogoSizeLabel(size) {
      for (let element of this.logoSizes) {
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

      // Append text
      let font = 30;
      ctx.font = font + "px small-caps bold Arial"
      ctx.fillStyle = '#616161FF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.save();
      let text = "Generated by bannershake.com"
      let xText = font;
      let yText = ctx.measureText(text).width;
      ctx.translate(xText, yText);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(text, 0, font / 4);
      ctx.restore();

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
        image.src = require("./static/" + element);
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
    postFeedback() {
      this.feedbackSubmitLoading = true;
      const data = {
        contactEmail: this.feedbackEmail,
        message: this.feedbackComment
      }

      fetch("/.netlify/functions/send-email", {
        method: 'post',
        body: JSON.stringify(data)
      }).then((response) => {
        if (response.status === 200) {
          this.snackbarText = this.$t('feedback.successMsg');
        } else {
          this.snackbarText = this.$t('feedback.errorMsg');
        }
      }).catch(() => {
        this.snackbarText = this.$t('feedback.errorMsg');
      }).finally(() => {
        this.feedbackDialog = false;
        this.snackbar = true;
        this.feedbackSubmitLoading = false;
      })
    }
  },
};
</script>
