/// <reference types="react-scripts" />
interface printessAttachParameters {
  resourcePath?: string;
  domain?: string;
  token?: string;
  uploadProvider?: UploadProvider;
  div: HTMLDivElement;
  /*  when used in shop (shop token) scenario, you MUST provide basketId */
  basketId?: string, 
  /* when used in shop (shop token) scenario, you CAN provide shopUserId */
  shopUserId?: string, 
  autoScale?: {
      maxWidth: number;
      maxHeight: number;
  };
  templateName?: string;
  templateJson?: string;
  templateUserId?: string;
  mergeTemplates?: [{
      templateName: string;
      templateUserId?: string;
  }];
  loadingFadeCallback?: () => void;
  loadingDoneCallback?: (spread: Array<iExternalSpreadInfo>) => void;
  showBuyerSide?: boolean;
  hideControls?: boolean;
  allowZoomAndPan?: boolean;
  zoomDuration?: number;
  formFieldChangedCallback?: externalFormFieldChangeCallback;
  selectionChangeCallback?: externalSelectionChangeCallback;
  spreadChangeCallback?: externalSpreadChangeCallback;
  getOverlayCallback?: externalGetOverlayCallback;
  forceMultilineFormEditing?: boolean;
  splitMultilineToParagraphs?: boolean;
  enterImageCropingOnSelect?: boolean;
  singleSelectionOnly?: boolean;
  scaledImageMinimumDpi?: number;
  fullScreenOnMobile?: boolean;
}

/*
* UPLOAD
*/
interface UploadProvider {
upload: (formData: FormData, progressCallback?: ProgressCallback) => Promise<UploadResult>; //der muss die Urls zurückgeben
beforeAddingFormData?: (formData: FormData, blob: Blob, fileName: string) => void;
}
type ProgressCallback = (uploaded: number, total: number) => void;
type UploadResult = {
originalFormName?: string,
id: string,
url: string,
userState?: string | number | Record<string, unknown>
}


/*
* Main call to load printess to div
*/
declare function attachPrintess(p: printessAttachParameters): Promise<api>;


/*
* JS-API Methods
*/
export type api = {

getJson(): string;
setJson(jsonString: string): Promise<void>;

loadTemplate(templateName: string): Promise<void>;

saveJson(): Promise<string>;
loadJson(id: string): Promise<void>;
unexpireJson(id: string): Promise<void>;

clearSelection(): Promise<void>;
deleteSelectedFrames(): Promise<boolean>;
selectFrames(propertyId: string): Promise<void>;
selectSpread(spreadIndex: number, part?: "entire" | "left-page" | "right-page"): Promise<void>;

getAllSpreads(): Promise<Array<iExternalSpreadInfo>>;
getAllProperties(): Promise<Array<Array<iExternalProperty>>>;
getAllPropertiesBySpreadId(spreadId: string): Promise<Array<Array<iExternalProperty>>>;
getAllRequiredProperties(): Promise<Array<Array<iExternalProperty>>>;
getAllRequiredPropertiesSync(): Array<Array<iExternalProperty>>;
getAllRequiredPropertiesBySpreadId(spreadId: string): Promise<Array<Array<iExternalProperty>>>;
getAllRequiredPropertiesBySpreadIdSync(spreadId: string): Array<Array<iExternalProperty>>;

setProperty(propertyId: string, propertyValue: string | number | iStoryContent): Promise<void>;

getNumberUi(ep: iExternalProperty, metaProperty?: iExternalMetaPropertyKind | null): {
  meta: iExternalNumberUi;
  value: number;
} | undefined;
setNumberUiProperty(ep: iExternalProperty, metaProperty: iExternalMetaPropertyKind | null, value: number): Promise<void>;

setTextStyleProperty(propertyId: string, name: "font" | "color" | "size" | "hAlign" | "vAlign", value: string, textStyleMode?: textStyleModeEnum): Promise<void>;
setImageMetaProperty(propertyId: string, name: "scale" | "sepia" | "brightness" | "saturate" | "contrast" | "grayscale" | "vivid" | "hueRotate", value: string | number): Promise<void>;
resetImageFilters(propertyId: string): Promise<void>;

uploadImages(files: FileList | null, progressCallback?: (percent: number) => void, assignToFrameOrNewFrame?: boolean): Promise<iExternalImage[]>;
uploadImage(file: File, progressCallback?: (percent: number) => void, assignToFrameOrNewFrame?: boolean): Promise<iExternalImage | null>;

getSerializedImage(imageId: string): string | null;
addSerializedImage(imageJson: string, assignToFrameOrNewFrame?: boolean): Promise<iExternalImage>;

getImages(propertyId: string): Array<iExternalImage>;
getFonts(propertyId: string): Array<{
  name: string;
  thumbUrl: string;
}>;
getColors(propertyId: string): Array<{
  name: string;
  color: string;
}>;
resizePrintess(immediate?: boolean): void;

load(scopeId: string, mode?: "auto" | "loadAlwaysFromServer"): Promise<void>;

insertLayoutSnippet(snippetUrl: string): Promise<void>;
insertGroupSnippet(snippetUrl: string): Promise<void>;

undo(): void;
redo(): void;

renderFirstPageImage(fileName: string, documentName?: string, maxWidth?: number, maxHeight?: number): Promise<string>;
};