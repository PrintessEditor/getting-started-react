/// <reference types="react-scripts" />

/** 
 * Main call to attach the Printess to div-element of your choice. 
 * In ```printessAttachParameters``` you can pass authorization, template-name and other parameters.
 */
export declare function attachPrintess(p: printessAttachParameters): Promise<iPrintessApi>;

export interface printessAttachParameters {
  resourcePath?: string;
  domain?: string;
  token?: string;
  uploadProvider?: UploadProvider;
  div: HTMLDivElement;
  /** 
   * when used in shop (shop token) scenario, you MUST provide basketId 
   */
  basketId?: string,
  /** 
   *  when used in shop (shop token) scenario, you CAN provide shopUserId  
   */
  shopUserId?: string,

  templateName?: string;
  /**
   *  The template version to load. For production you should go with "published" which is the default. 
   * */
  templateVersion?: "draft" | "published",

  /**
   * Optional parameter to merge any number of templates during load
   */
  mergeTemplates?: [iMergeTemplate];

  /**
   * Activated by default. Deactivating `allowZoomAndPan` freezes the visible Area of the current document. 
   * The buyer will not be able to zoom or pan at all. It's handy for simple configurattions on desktop and conjunction with ```autoScale```
   * Handle with care on mobile, since users proably need zoom to have a closer look on their products.
   */
  allowZoomAndPan?: boolean;

  /**
   * When zooming to a selected page, Printess uses a viewport transition. You can either set the transition duration in seconds or pass **0** to 
   * turn animation of completely.
   */
  zoomDuration?: number;

  /**
   * Auto scale is only usefull when `allowZoomAndPan`is disabled.
   * Printess will adjust its width or height in between the given dimensions to meet the aspect ratio of the loaded document.
   */
  autoScale?: {
    maxWidth: number;
    maxHeight: number;
  };

  /**
   * list if custom-translations to be used by Printess buyer-side.
   * If set, it overrides all translations from your account-settings
   * https://printess.com/kb/api-reference/custom-integration/index.html#translations
   */
  translations?: Record<string, Record<string, string> | string>;

  /**
   * Pass key of desired languages, fallbacks to "auto" -> window.navigator.language
   */
  translationKey?: string | "auto";

  /**
   * To prevent the use of offensive language in customizeable texts, you can pass a list of forbidden words.
   * The use of offensive words can either throw an error during the validation or trigger the replacement of a bad word. 
   * https://printess.com/kb/api-reference/custom-integration/index.html#offensive-language
   */
  offensiveWords?: string,

  /**
   * Enables offensive word check for all editable text frames 
   */
  offensiveCheckAll?: false,

  /**
  * Disables thumbnail-creation when pressing the add to basket button.
  * Its checked only in uiHelper. 
  * Thumbnails can independendtly created with:
  * `const url = await printess.renderFirstPageImage("thumbnail.png");`
  */
  noBasketThumbnail?: false,

  /**
   * Optional: set frame warnings via api (can be set in template-presets as well) 
   */
  showFrameWarnings?: "sign and hint" | "sign only" | "hint only" | "none";

  /**
   * Turns animations for selected frames of, no matter what is set in the template. 
   */
  buyerSelectionAnimation?: boolean;

  /**
   * If you application displays a loading animation, this call tells you to start
   * your fade-out animation. Loading will be done soon. 
   */
  loadingFadeCallback?: () => void;

  /**
   * Printess has completely loaded the requested template and is now ready to operate.
   */
  loadingDoneCallback?: () => void;

  /**
   * Force Showing Buyer-Side (Only valid if Service-Token is passed)
   * When Token is Shop-Token, Printess alwyas switches to Buyer-Side.
   */
  showBuyerSide?: boolean;

  /**
   * The initial form fields you want to fill.
   */
  formFields: Array<{ name: string, value: string }>;

  /**
  * Minimum width of any image loaded in the browser
  * Default is 1600, best alternatives are 200, 400, 800
  * If you display the Printess editor very small in your website/shop
  * you might want to avoid the editor loading large images into memory. 
  * You can also set **minImageWidth** for certain products with many pages. 
  */
  minImageWidth?: number;

  /**
   * Fires when an template has been opened from the open menu.
   */
  templateOpenedCallback?: (templateName: string, hasPublishedVersion: boolean) => void;

  /**
  * Fires when an template has been saved and published.
  */
  templatePublishedCallback?: (templateName: string) => void;

  /**
   * For every Form Field which is set to **Impact-Price**
   * Printess fires a callback when the value has changed
   */
  formFieldChangedCallback?: externalFormFieldChangeCallback;

  /**
   * Here is the place to draw your properties ui.
   */
  selectionChangeCallback?: externalSelectionChangeCallback;

  /**
   * Fired whenever the user has selected a new page/spread and passes snippet-lists and spread-info.
   * Now it's time to redraw **Layout-Snippets** and **Group-Snippets**
   */
  spreadChangeCallback?: externalSpreadChangeCallback;

  /**
   * To indicate selectable frames Printess fires this callback where you can 
   * provide a custom div
   */
  getOverlayCallback?: externalGetOverlayCallback;

  /**
   * Is called when the page navigation has changed (and needs redraw) but selection has stayed the same.
   */
  refreshPaginationCallback?: refreshPaginationCallback;

  /**
   * Provide a callback function which is called when the buyer presses the [Add to Basket] button
   * Design is automtically saved and function gets a [token] to load or print this design.
   */
  addToBasketCallback?: (saveToken: string, thumbnailUrl: string) => void,

  /**
   * Provide a callback function which is called when the buyer presses the [Back] button
   * Design is automtically saved and function gets a [token] to load or print this design
   */
  backButtonCallback?: (saveToken: string) => void,

  /**
   * Provide a callback function which is called whenever the buyer-image-list changed or an image is assigned to a frame
   * Use it, to redraw your buyer-image list if you have one.
   */
  imageListChangeCallback?: () => void,
}


/**
 * **iPrintessApi** is returned by the ```attachPrintess()``` call and provides you access to the Printess editor. 
 * You can retrieve informations, set properties, add snippets and much more.
 */
export interface iPrintessApi {
  getJson(): string;
  setJson(jsonString: string): Promise<void>;

  /**
   * Load a template to the Printess editor.
   * @param templateNameOrToken can be either the name of a template (case sensitive) or the save-token received as a result of a user design save. 
   * @param mergeTemplates optional parameter to pass other templates to merge 
   */
  loadTemplate(templateNameOrToken: string, mergeTemplates?: [iMergeTemplate]): Promise<void>

  /**
   * @deprecated 
   */
  saveJson(): Promise<string>;
  /**
   * @deprecated
   */
  loadJson(saveToken: string): Promise<void>;

  /**
   * Saves current artwork
   * @returns `saveToken` which you can pass on `attachPrintess()` or `load()`
   */
  save(): Promise<string>;

  /**
   * Loads template or previously saved buyer artwork (`saveToken`)
   * @param templateNameOrSaveToken a templateName or a `saveToken` you have received from basket- or back-callback or from `save()` call
   */
  load(templateNameOrSaveToken: string, mode?: "auto" | "loadAlwaysFromServer"): Promise<void>;


  /**
   * Expects a apreviously saved buyer artwork identified by a saveToken and ensures that this work will never be deleted from DB
   * @param saveToken  
   */
  unexpireJson(saveToken: string): Promise<void>;

  /**
   * Returns the add to basket callback you have set in `attachPrintess()`
   */
  getAddToBasketCallback(): null | ((saveToken: string, url: string) => void);

  /**
   * Returns true if the `noBasketThumbnail` flag was set on attach.
   */
  noBasketThumbnail(): boolean

  /**
   * Returns the back button callback you have set in `attachPrintess()`
   */
  getBackButtonCallback(): null | ((saveToken: string) => void);

  /**
   * Clears current printess frames selection and shows document-wide properties like form fields.
   */
  clearSelection(): Promise<void>;

  /**
   * Deletes all selected frames which are allowed to be removed by the buyer
   */
  deleteSelectedFrames(): Promise<boolean>;

  /**
   * Select frame by propertyId. Fires a subsequent selection changed callback.
   */
  selectFrames(propertyId: string): Promise<void>;

  /**
   * Select and zoom to the frame(s) mentioned in the error object.
   * @param err
   * @param zoomToSelection Overrides the default zoom behaviour of the item / template
   */
  bringErrorIntoView(err: iExternalError, zoomToSelection?: boolean): Promise<void>

  /**
   * Selects all frames which are marked as **background**
   */
  selectBackground(): Promise<void>;

  /**
   * Indicates if the current spread has editable background frames
   */
  hasBackground(): boolean

  /**
   * Selects a spread and brings it into view. spread-index is zero based and even a facing page counts as a single spread. You can pass the focus area in the `part`parameter.
   * @param spreadIndex zero-based 
   * @param part  "entire" | "left-page" | "right-page"
   */
  selectSpread(spreadIndex: number, part?: "entire" | "left-page" | "right-page"): Promise<void>;

  /**
   * Moves Printess focus to next page if available. Focus on single pages not spreads.
   */
  nextPage(): Promise<void>;

  /**
   * Moves Printess focus to previous page if available. Focus on single pages not spreads.
   */
  previousPage(): Promise<void>;

  /**
   * Retrieves information about the currently selected page. 
   * Returns natural page-number (current) staring from 1 (not spread-index), page-count (max) and flags if the current page isFirst or isLast page of the current document
   * First and last pages are identical to the spread in facing page documents. 
   * Async version waits for Printess to be fully loaded.
   */
  pageInfo(): Promise<{ current: number, max: number, isFirst: boolean, isLast: boolean, spreadId: string }>


  /**
   * Retrieves information about the currently selected page. 
   * Returns natural page-number (current) staring from 1 (not spread-index), page-count (max) and flags if the current page isFirst or isLast page of the current document
   * First and last pages are identical to the spread in facing page documents. 
   * Sync version returns dummy data if Printess is not fully loaded.
   */
  pageInfoSync(): { current: number, max: number, isFirst: boolean, isLast: boolean, spreadId: string }

  /**
   * Returns information about all spreads of the displayed document as an Array of `iExternalSpreadInfo` 
   */
  getAllSpreads(): Array<iExternalSpreadInfo>;

  /**
   * Returns total number of spreads (not pages)
   */
  spreadCount(): number

  /**
  * Returns true is the user has made edits on a spread.
  * @param spreadIdOrIndex: ID or Index of Spread to check for - if empty it checks for current spread
  */
  hasBuyerContentEdits(spreadIdOrIndex?: string | number): boolean

  /**
   * Returns only false if property refers to a formfield which is not visible, because it doesn' match a specific condition.
   * @param propertyId ID of property to check
   */
  isPropertyVisible(propertyId: string): boolean

  /**
   * Returns all available properties in teh current document
   */
  getAllProperties(): Promise<Array<Array<iExternalProperty>>>;



  /**
   * Returns a list of all available properties on a specific spread
   * @param spreadId 
   */
  getAllPropertiesBySpreadId(spreadId: string): Promise<Array<Array<iExternalProperty>>>;


  /**
  * Returns a list of all required properties (async)
  * @param spreadId 
  */
  getAllRequiredProperties(): Promise<Array<Array<iExternalProperty>>>;

  /**
    * Returns a list of all required properties (sync)
    * @param spreadId 
    */
  getAllRequiredPropertiesSync(): Array<Array<iExternalProperty>>;

  /**
  * Returns a list of all required properties on a specific spread (async)
  * @param spreadId 
  */
  getAllRequiredPropertiesBySpreadId(spreadId: string): Promise<Array<Array<iExternalProperty>>>;
  /**
   * Returns a list of all required properties on a specific spread (sync)
   * @param spreadId 
   */
  getAllRequiredPropertiesBySpreadIdSync(spreadId: string): Array<Array<iExternalProperty>>;

  /**
   * Mobile UI helper method to convert a list of properties to a list of mobile buttons to show to the buyer
   * @param properties list of properties to get buttons from
   * @param propertyIdFilter can be the *id* of a specific property to get only property related buttons (for images and multi-line text)
   *                         "all" returns only top level buttons (no sub/meta property buttons)
   *                         "root" returns only top-level properties but sets the `hasCollapsedMetaProperties` flag if applicable
   */
  getMobileUiButtons(properties: Array<iExternalProperty>, propertyIdFilter: "all" | "root" | string): Array<iMobileUIButton>;

  /**
   * Returns change background button if available
   */
  getMobileUiBackgroundButton(): Array<iMobileUIButton>

  /**
   * Mobile UI helper method to get model to draw a circle button including icons, gauge, etc.
   * uiHelper.js contains a method to create an SVG from this circle model
   * @param m The mobile button to create a circle for
   * @param isSelected If the button is selected
   */
  getButtonCircleModel(m: iMobileUIButton, isSelected: boolean): iButtonCircle

  /**
   * Returns a simple ui to change the postion of an image 
   */
  createCropUi(propertyId: string): null | { container: HTMLDivElement, setScale: (s: number) => void, getCropBox(): { top: number, left: number, width: number, height: number } }

  /**
   * Creates a new cropped image and assigns it to the passed form-field. Takes the currently assigned image as master
   * @param propertyId id of a form-field-property (type of image-id) pointing to a valid image 
   * @param box all box coordinates are expected to be in the range of 0 to 1 
   */
  cropImage(propertyId: string, box: { left: number, top: number, width: number, height: number }): Promise<iExternalImage | null>

  /**
   * Returns if a iMobileUIButton should display text instead of an icon
   */
  isTextButton(m: iMobileUIButton): boolean


  /**
   * Sets the value of any top-level property passed to the external UI
   * @param propertyId 
   * @param propertyValue Must be string and will be converted if neccessary
   */
  setProperty(propertyId: string, propertyValue: string | number | iStoryContent): Promise<void | (iExternalImageScaleHints & { scale: number })>; // | Array<iExternalColorUpdate>>;

  /**
   * Sets the vaue of a form field
   * @param fieldNameOrId Name of the Form-Field or Form-Field Property-ID
   * @param newValue Must be string and will be converted if neccessary
   */
  setFormFieldValue(fieldName: string, newValue: string): Promise<void>;

  /**
   * Sets the size of a specific document 
   * @param documentName Name of the document to change
   * @param widthInDocUnit 12 equals e.g. "12cm"
   * @param heightInDocUnit 12 equals e.g. "12cm"
   */
  setDocumentSize(documentName: string, widthInDocUnit: number, heightInDocUnit: number): Promise<void>

  /**
   * Returns the current form field value and its possible list values if available
   * @param fieldName Name of the Form-Field or Form-Field Property-ID
   */
  getFormField(fieldName: string): Promise<{
    value: null | string | number | Array<Record<string, any>>,
    list?: Array<{
      key: string,
      label?: string,
      description?: string,
      imageId?: string
    }>
  } | undefined>


  /**
   * Returns the number UI model for any numeric property
   * `iExternalNumberUi` and value will be returned and has min, max and step info
   * Important: Number models can have different value ranges than the values stored in printess for better user experience
   * uiHelper.js conatins a method to create a slider control from this model
   * @param property 
   * @param metaProperty 
   */
  getNumberUi(property: iExternalProperty, metaProperty?: iExternalMetaPropertyKind | null): {
    meta: iExternalNumberUi;
    value: number;
  } | undefined;
  /**
   * Sets a numric values based on a retrieved number model. 
   * Number models can have different value ranges than the values stored in printess 
   * If a number value has been retrieved by `getNumberUi` its mandatory to set it via `setNumberUiProperty`
   * @param property 
   * @param metaProperty 
   * @param value 
   */
  setNumberUiProperty(property: iExternalProperty, metaProperty: iExternalMetaPropertyKind | null, value: number): Promise<void>;

  /**
   * Method to set a text style meta-property
   * @param propertyId 
   * @param name 
   * @param value 
   * @param textStyleMode 
   */
  setTextStyleProperty(propertyId: string, name: "font" | "color" | "size" | "hAlign" | "vAlign", value: string, textStyleMode?: textStyleModeEnum): Promise<void>;

  /**
   * Method to set an image meta-property
   * Set the image itself via `setProperty()`
   * @param propertyId 
   * @param name 
   * @param value 
   */
  setImageMetaProperty(propertyId: string, name: "scale" | "sepia" | "brightness" | "saturate" | "contrast" | "grayscale" | "vivid" | "hueRotate", value: string | number): Promise<void>;

  /**
   * Resets all image filters (meta-values) of an image-property to default
   * @param propertyId 
   * @param imageMeta optional parameter, can be used to set all image-filters to specific values.
   */
  resetImageFilters(
    propertyId: string,
    imageMeta?: {
      brightness?: number,
      sepia?: number,
      hueRotate?: number,
      contrast?: number,
      vivid?: number,
    }): Promise<void>;

  /**
   * Uploads one or many images to Printess and can auto assign the first image
   * @param files 
   * @param progressCallback 
   * @param assignToFrameOrNewFrame Auto assigns the first image to the current slection or a specific frame
   * @param propertyId Auto assigns the first image to a specific frame identified via property Id.
   */
  uploadImages(files: FileList | null, progressCallback?: (percent: number) => void, assignToFrameOrNewFrame?: boolean, propertyId?: string): Promise<iExternalImage[]>;

  /**
   * Uploads a single image to Printess and can auto assign this image
   * @param file 
   * @param progressCallback 
   * @param assignToFrameOrNewFrame 
   * @param propertyId 
   */
  uploadImage(file: File, progressCallback?: (percent: number) => void, assignToFrameOrNewFrame?: boolean, propertyId?: string): Promise<iExternalImage | null>;

  /**
   * Rotates an image by 90deg and saves the result as new image and assigns rotated image to frame automatically.
   * @param propertyId 
   * @param angle 
   */
  rotateImage(propertyId: string, angle: "0" | "90" | "180" | "270"): Promise<iExternalImage | null>;

  /**
  * Imports a single image to Printess and can auto assign this image
  * @param url The url to the image you want to import to Printess.
  * @param assignToFrameOrNewFrame Assign this image to the current frame, or create a new frame in case none is selected.
  * @param propertyId 
  */
  importImageFromUrl(url: string, assignToFrameOrNewFrame?: boolean, propertyId?: string): Promise<iExternalImage | null>;
  getSerializedImage(imageId: string): string | null;
  addSerializedImage(imageJson: string, assignToFrameOrNewFrame?: boolean): Promise<iExternalImage>;

  /**
   * Returns Buyer-Side Flag if ui should show a dedicated image tab
   */
  showImageTab(): boolean;

  /**
   * Retrieve the caption for the document-form-field-tab 
   */
  formFieldTabCaption(): string

  /**
   * automatically distribute all non used uploaded images to frames which have not been assigned yet.
   * Returns a list of all applied image-ids.
   */
  distributeImages(): Promise<Array<string>>

  /**
   * check number of distributable image boxes 
   * if greater than 1 return true
   */
  allowImageDistribution(): boolean

  /**
   * delete buyer uploaded images that are not in use
   * Returns the number of successfully deleted images.
   * @param images array of images to be deleted
   */
  deleteImages(images: Array<iExternalImage>): number

  /**
   * If property is empty it returns the list of buyer uploaded images.
   * @param propertyId id of property which shows the image list
   */
  getImages(propertyId?: string): Array<iExternalImage>

  /**
   * Returns all buyer uploaded images including information if the image is in use
   */
  getAllImages(): Array<iExternalImage>

  /**
   * Returns image-count in "Buyer Upload" folder.
   */
  getUploadedImagesCount(): number

  /**
   * Returns if an externalProperty resolves to multiple mobile-ui-buttons
   * @param p 
   */
  hasMetaProperties(p: iExternalProperty): boolean

  /**
   * Returns if a specific image is used in buyer editable frame.
   * @param imageId Id of image to test
   */
  isImageInUse(imageId: string): boolean

  getFonts(propertyId: string): Array<{
    name: string;
    thumbUrl: string;
    displayName: string;
    familyName: string;
    weight: number;
    isItalic: boolean;
  }>;

  getColors(propertyId: string): Array<{
    name: string;
    color: string;
  }>;




  /**
   * Retrieves a SVG icon from printess
   * @param icon 
   */
  getIcon(icon: iconName): SVGElement

  /**
   * Returns true if printess has full Designer edit rights and is not running in Shop-Mode
   */
  isInDesignerMode(): boolean;

  /**
   * Trigger a resize and fit of the current page, can focus the selection alternatively.
   * @param immediate Optional: Determines if resize should wait for a second or happens immediatly
   * @param focusSelection Optional: Will zoom to current selection
   * @param width Optional: Overrides the retrieved offsetWidth of the printess container - helpfull when animation are longer running
   * @param height Optional: Overrides the retrieved offsetHeight of the printess container - helpfull when animation are longer running
   */
  resizePrintess(immediate?: boolean, focusSelection?: boolean, width?: number, height?: number, focusFormFieldId?: string): void;

  getTemplateTitle(): string;

  insertLayoutSnippet(snippetUrl: string): Promise<void>;
  insertGroupSnippet(snippetUrl: string): Promise<void>;

  /**
   * Saves and publishes the template.
   * @param name The name you want to save the template under.
   */
  saveAndPublish(name: string): Promise<void>;

  /**
   * Returns if buyer ui should display the page navigation
   */
  showPageNavigation(): boolean;

  /**
   * Returns if buyer ui should display undo and redo buttons
   */
  showUndoRedo(): boolean

  /**
   * Executes an undo step if available.
   */
  undo(): void;

  /**
   * Executes an redo step if available.
   */
  redo(): void;

  /**
   * Returns number of available undo steps
   */
  undoCount(): number

  /**
   * Returns number of available redo steps
   */
  redoCount(): number

  renderFirstPageImage(fileName: string, documentName?: string, maxWidth?: number, maxHeight?: number): Promise<string>;


  /**
   * Renders all pages as images for the given document. 
   * @param fileNameSuffix The file name suffix when uploading the image. All files will be prefixed with the page index + underscore character.
   * @param documentName Optional: The name of the document you want to render the pages images for. If not provided the one marked as thumbnail will be taken, otherwise the preview document, or as last try the first/primary document.
   * @param maxWidth Optional: Maximum render width. Defaults to 400.
   * @param maxHeight Optional: Maximum render height. Defaults to 400.
   */
  renderPageImages(fileNameSuffix: string, documentName?: string, maxWidth?: number, maxHeight?: number): Promise<string[]>;

  isMobile(): boolean;

  getStep(): iBuyerStep | null;
  /**
   * Indicates if the current step has become inactive, because the user has selected other frames 
   * TRUE if the current step is part of the selection.
   */
  isCurrentStepActive(): boolean;

  /**
   * Indicates if the current template has buyer-steps 
   */
  hasSteps(): boolean

  /**
   * 
   * @param index Sets step by index
   * @param zoom 
   */
  setStep(index: number, zoom?: "frame" | "spread"): Promise<void>

  /**
   * Retrieves last step
   */
  lastStep(): iBuyerStep | null;

  /**
   * Returns true if a next step is available
   */
  hasNextStep(): boolean;

  /**
   * Returns true if a previous step is availabel
   */
  hasPreviousStep(): boolean;

  /**
   * Indicates if the next step is the preview document.
   */
  isNextStepPreview(): boolean;

  /**
   * Return true if buyer can deselect an item on the current spread. 
   * Important to keep buyer in the step-logic
   */
  buyerCanHaveEmptySelection(): boolean;

  /** 
   * returns desired behaviour of basket button  
   * In steps-mode basket button always points to the basket. 
   * If no steps are present basket button should lead to the preview
   */
  getBasketButtonBehaviour(): "add-to-basket" | "go-to-preview"

  hasPreviewBackButton(): boolean

  gotoPreviousPreviewDocument(): Promise<void>

  gotoNextPreviewDocument(): Promise<void>




  /**
   * Goes to the next available step (if any)
   * @param zoom overrides the frames zoom settings for all devices
   */
  nextStep(zoom?: "frame" | "spread"): Promise<void>;


  /**
   * Goes to the previous step (if any)
   * @param zoom overrides the frames zoom settings for all devices
   */
  previousStep(zoom?: "frame" | "spread"): Promise<void>;

  /**
   * Returns the total amount of available preview-steps. 0 indicates no preview
   */
  previewStepsCount(): number;

  /**
   * Goes directly to the preview-step-index 
   * @param previewIndex Zero based index of the preview steps. See also: previewStepsCount()
   * @param zoom overrides the frames zoom settings for all devices
   */
  gotoPreviewStep(previewIndex?: number, zoom?: "frame" | "spread"): Promise<void>;

  /**
   * Returns to the first step, helpful if you want to exit the preview step.
   * @param zoom overrides the frames zoom settings for all devices
   */
  gotoFirstStep(zoom?: "frame" | "spread"): Promise<void>;

  /**
   * Returns to the last step, helpful if you want to skip steps.
   * @param zoom overrides the frames zoom settings for all devices
   */
  gotoLastStep(zoom?: "frame" | "spread"): Promise<void>;

  /**
   * Turns the display of step numbers on or off
   */
  displayStepNumbers(display: boolean): Promise<void>

  /**
   * Returns if step numbers are displayed 
   */
  stepNumbersDisplayed(): boolean

  /**
   * Returns the template settings for display of steps header on desktop and mobile
   */
  stepHeaderDisplay(): "never" | "only title" | "only badge" | "title and badge" | "badge list"

  /**
   * Displays a grey overlay on printess editor
   * @param message Message to show on overlay
   */
  showOverlay(message: string): void;

  /**
   * Hides printess editor overlay (see showOverlay())
   */
  hideOverlay(): void;

  /**
   * @deprecated
   * Returns true if `autoScale` was set in `attachPrintess` call
   */
  autoScaleEnabled(): boolean

  /**
   * Retrieves information if the `auto-scale` option was enabled on `attachPrintess()` 
   * Also returns the calculated pixel-dimension of printess container on desktop
   */
  autoScaleDetails(): { enabled: boolean, width: number, height: number }

  /**
   * 
   * @param uploadEndpoint The target address to send the upload form data to. E.g. https://your-bucket.s3.eu-central-1.amazonaws.com/ 
   * @param serveEndpoint The url the files are served from. This can differ from the upload endpoint to make CDN distribution possible. E.g. https://mycloudfrontid.amazonaws.com/
   * @param keyGenerator The method to generate the S3 key. The built-in one just makes sure that the file name is unique per session.
   */
  createAwsUploaderProvider(uploadEndpoint: string, serveEndpoint?: string, keyGenerator?: (fileName: string, fileHash: string) => string): AwsUploadProvider;

  /**
   * @deprecated
   */
  getContentEditables(): TemplateEditables;

  /**
   * Returns all default english translations or if language property is set / browser language is detected (if set to auto) the respective translation if available
   */
  getTranslations(): Record<string, Record<string, string | number> | string | number>;

  /**
   * Returns an array of external property errors that can be used to display errors like missing text to the customer
   * @param mode Specifies when and up to which point the validation should be done.
   */
  validate(mode?: "all" | "until-current-step" | "selection"): Array<iExternalError>

  /**
   * Returns true if the associated mutli-line text-frame has text which does not fit into the frame
   * @param propertyId 
   */
  hasTextOverflow(propertyId: string): boolean

  /**
   * Returns a translation as string to display the ui in different languages
   * @param translationKey String containing the keys for the translation table separated by period
   * @param params String or number parameters that substitute $1, ..., $9 properties in a translation
   */
  gl(translationKey: string, ...params: Array<string | number>): string
}

export interface iBuyerStep {
  index: number,
  boxId?: string,
  docId: string,
  title: string
}



/*
* UPLOAD
*/
export interface UploadProvider {
  /** The main method to upload data. */
  upload: (formData: FormData, progressCallback?: ProgressCallback) => Promise<UploadResult>;

  /** Specialized method for uploading images. You can simply forward it to upload in case you don't need special handling of those. */
  uploadImage: (formData: FormData, progressCallback?: ProgressCallback) => Promise<UploadResult>;

  /** Specialized method for uploading fonts. You can simply forward it to upload in case you don't need special handling of those. */
  uploadFont: (formData: FormData, progressCallback?: ProgressCallback) => Promise<UploadResult>;

  /** This method is called before Printess adds the form data containing the data needed for the upload. Use it in case you must prepend some fields to the form data before. */
  beforeAddingFormData?: (formData: FormData, blob: Blob, fileName: string) => void;
}

export interface AwsUploadProvider extends UploadProvider {
  /** The method which generates the final key to store within S3. */
  keyGenerator: (fileName: string, fileHash: string) => string;
}


export type ProgressCallback = (uploaded: number, total: number) => void;
export type UploadResult = {
  originalFormName?: string,
  id: string,
  url: string,
  userState?: string | number | Record<string, unknown>
}


export declare type iExternalFormFieldInfos = Array<iExternalFormFieldInfo>;
export interface iExternalFormFieldInfo {
  name: string;
  values: Array<string>;
}
export interface iExternalSpreadInfo {
  spreadId: string;
  /**
   * Zero based spread index (not page nr)
   */
  index: number;
  /**
  * Name of spread if set by the designer
  */
  name: string;
  /**
  * Spread width in pixel
  */
  width: number;
  /**
  * Spread height in pixel
  */
  height: number;
  /**
  * Number of pages in this spread. Will be 1 or 2.
  */
  pages: number;
}
export interface iExternalSpread {
  groupSnippets: ReadonlyArray<iExternalSnippet>;
  layoutSnippets: ReadonlyArray<iExternalSnippet>;
  spreadId: string;
}
export interface iExternalSnippetCluster {
  name: string;
  snippets: Array<iExternalSnippet>;
}
export interface iExternalSnippet {
  title: string;
  snippetUrl: string;
  thumbUrl: string;
  bgColor: string;
}
export interface iExternalFrameBounds {
  zoom: number;
  pageOffsetY: number;
  pageOffsetX: number;
  left: number;
  top: number;
  width: number;
  height: number;
  boxId: string;
}

export type iExternalPropertyKind = "color" | "single-line-text" | "text-area" | "background-button" | "multi-line-text" | "selection-text-style" | "number" | "image" | "select-list" | "image-list" | "color-list" | "table" | "image-id";

export type iExternalMetaPropertyKind = null |
  "text-style-color" | "text-style-size" | "text-style-font" | "text-style-hAlign" | "text-style-vAlign" | "text-style-vAlign-hAlign" |
  "image-scale" | "image-sepia" | "image-brightness" | "image-contrast" | "image-vivid" | "image-hueRotate" | "image-rotation" | "image-crop";

export interface iExternalProperty {
  id: string;
  value: string | number;
  kind: iExternalPropertyKind;
  label: string;
  validation?: iExternalValidation;
  textStyle?: iExternalTextStyle;
  imageMeta?: iExternalimageMeta;
  listMeta?: iExternalListMeta;
  tableMeta?: iExternalTableMeta;
}
export interface iExternalTextStyle {
  size: string;
  color: string;
  font: string;
  hAlign: "bullet" | "left" | "center" | "right" | "justifyLeft" | "justifyCenter" | "justifyRight" | "justifyJustify";
  vAlign: "top" | "center" | "bottom";
  allows: Array<"content" | "mandatory" | "color" | "stroke" | "font" | "size" | "lineHeight" | "tracking" | "baselineShift" | "horizontalAlignment" | "verticalAlignment" | "padding" | "styles" | "bullet" | "indent" | "paragraphSpacing" | "baselineGrid">;
}
export interface iExternalValidation {
  maxChars: number;
  defaultValue: string;
  isMandatory: boolean;
  clearOnFocus: boolean;
  noOffensiveLanguage: boolean;
  visibility: "always" | "conditional-on" | "conditional-off";
}
export interface iExternalListMeta {
  list: Array<iExternalFieldListEntry>;
  thumbWidth: number;
  thumbHeight: number;
  imageCss: string;
}
export type iExternalFieldListEntry = {
  key: string,
  label: string, // multi-language??
  description: string,
  imageUrl: string
}
export interface iExternalTableMeta {
  columns: Array<iExternalTableColumn>;
  month?: number;
  tableType: "generic" | "calendar-events";
}
export interface iExternalTableColumn {
  name: string,
  label?: string,
  readonly?: boolean,
  data?: "string" | "boolean" | "number" | "image",
  list?: Array<string | number>,
  width?: string
}
export interface iExternalNumberUi {
  max: number;
  min: number;
  step: number;
  digits: number;
  postfix: string;
  restrictRange?: boolean;
  restrictStep?: boolean;
}
export interface iExternalNumberMeta {
  max: number;
  min: number;
  step: number;
  digits: number;
  postfix: string;
  restrictRange?: boolean;
  restrictStep?: boolean;
  uiOffset?: number;
  uiMultiplier?: number;
}
export interface iExternalimageMeta {
  scale: number;
  scaleHints: iExternalImageScaleHints;
  sepia: number;
  brightness: number;
  contrast: number;
  vivid: number;
  hueRotate: number;
  thumbUrl: string;
  thumbCssUrl: string;
  canUpload: boolean;
  /**
  * Indicates if you can modify scaling on that image 
  */
  canScale: boolean;
  allows: Array<"sepia" | "brightness" | "contrast" | "vivid" | "hueRotate">;
}
export interface iExternalImageScaleHints {
  min: number;
  max: number;
  dpiAtScale1: number;
}

export type iExternalErrors = Array<iExternalError>

export interface iExternalError {
  boxIds: Array<string>,
  errorCode: "imageResolutionLow" | "imageMissing" | "textMissing" | "characterMissing" | "maxCharsExceeded" | "offensiveLanguageDetected" | "textOverflow" | "noLayoutSnippetSelected",
  errorValue1: string | number,
  errorValue2?: string | number,
}

export type MergeMode = "merge" | "layout-snippet-no-repeat" | "layout-snippet-repeat-all" | "layout-snippet-repeat-inside";
export type MergeResource = "snippets" | "fonts" | "colors" | "images";

export interface iMergeTemplate {
  /**
   * Name of the template to load an merge into the currently loaded template 
   */
  templateName: string;
  /**
   * Name of the document you want to merge. If none is specified the primary document of the template will be taken.
   */
  documentName?: string;
  /**
   * At what spread index the incoming template will be merged
   */
  spreadIndex?: number;
  /**
   * Force Printess to merge in a particular layout-snippet mode. 
   * Frames which are merged as "layout-snippets" or "repeat-snippets" will be removed once the user places a new layout-snippet of the same type.
   */
  mergeMode?: MergeMode;
  /**
   * Define which resources you want to merge from the template additionally. 
   */
  mergeResources?: MergeResource[];
}

export declare type externalFormFieldChangeCallback = (name: string, value: string) => void;
export declare type externalSelectionChangeCallback = (properties: Array<iExternalProperty>, scope: "document" | "frames" | "text") => void;
export declare type externalSpreadChangeCallback = (groupSnippets: ReadonlyArray<iExternalSnippetCluster>, layoutSnippets: ReadonlyArray<iExternalSnippetCluster>) => void;
export declare type externalGetOverlayCallback = (properties: Array<{ kind: iExternalPropertyKind }>) => HTMLDivElement;
export declare type refreshPaginationCallback = null | (() => void);
export declare type textStyleModeEnum = "default" | "all-paragraphs" | "all-paragraphs-if-no-selection";

export interface iExternalImage {
  id: string;
  thumbUrl: string;
  thumbCssUrl: string;
  width: number;
  height: number;
  inUse: boolean;
}

export interface iExternalButton {
  type: "callback" | "print" | "back" | "next" | "addToBasket" | "undo" | "redo",
  callback?: () => void,
  caption?: string
}


export interface iMobileUIButton {
  icon?: iconName | "none",
  thumbCssUrl?: string,
  circleStyle?: string,
  ffCircleCaption?: string,
  caption: string,
  hasCollapsedMetaProperties: boolean,
  newState: iMobileUiState
}

export interface iMobileUiState {
  state: "ext-value" | "form-fields" | "add" | "selection" | "imageCrop" | "table-add" | "table-edit"
  externalProperty?: iExternalProperty,
  metaProperty?: iExternalMetaPropertyKind,
  tableRowIndex?: number
}


export type MobileUiState = "document" | "frames" | "add" | "details";

export interface MobileUiMenuItems {
  id: "back" | "undo" | "redo" | "previous" | "next" | "firstStep" | "lastStep",
  title: string,
  icon: iconName,
  disabled: boolean,
  show: boolean,
  task: any
}

export interface iButtonCircle {
  hasSvgCircle: boolean,
  hasImage: boolean,
  hasCaption: boolean,
  hasColor: boolean,
  hasIcon: boolean,
  icon: iconName | "none",
  displayGauge: boolean,
  gaugeValue: number,
  isSelected: boolean,
  captionClass: string,
  captionInCircle: string,
  color: string
}

export interface iStoryContent {
  pts: Array<any> // Array<iParagraphTextAndStyles>
}

export interface FormFieldEntry {
  key: string;
  label: string;
  description: string;
}

export interface FormFieldItem {
  name: string;
  value: string;
  visibility: string;
  isPriceRelevant: boolean;
  entries: FormFieldEntry[];
}

export interface ContentEditableItem {
  id: string;
  name: string;
  isMandatory: boolean;
  value: string;
  maxCharacters: number;
}

export interface DocumentContentEditables {
  id: string;
  name: string;
  simpleTexts: ContentEditableItem[];
  multilineTexts: ContentEditableItem[];
  images: ContentEditableItem[];
  stories: Record<string, string[]>;
}

export interface TemplateEditables {
  primaryDocument: DocumentContentEditables;
  formFields: FormFieldItem[];
}

export type iconName =
  "image"
  | "portrait"
  | "bezier"
  | "text"
  | "pathText"
  | "magnet"
  | "pointer"
  | "close-square"
  | "close"
  | "docRef"
  | "collapseLeft"
  | "expandLeft"
  | "edit"
  | "pen"
  | "pencil-ruler"
  | "plus"
  | "plus-circle"
  | "plus-square"
  | "minus"
  | "shapes"
  | "square"
  | "settings"
  | "vector-shape"
  | "address-card"
  | "paperclip"
  | "facing-pages"
  | "page"
  | "cog"
  | "perspective"
  | "style"
  | "story"
  | "text-flow"
  | "exchange"
  | "text-align-justify-justify"
  | "text-align-justify-left"
  | "text-align-justify-right"
  | "text-align-justify-center"
  | "text-align-left"
  | "text-align-right"
  | "text-align-center"
  | "check"
  | "check-square"
  | "user-circle"
  | "user-solid"
  | "user-crown-solid"
  | "arrow-left"
  | "arrow-right"
  | "arrow-up"
  | "arrow-down"
  | "arrows"
  | "arrows-circle"
  | "arrows-h"
  | "arrows-v"
  | "carret-down-solid"
  | "carret-right-solid"
  | "carret-left-solid"
  | "text-size"
  | "text-width"
  | "line-height"
  | "line-width"
  | "palette"
  | "brush"
  | "undo"
  | "undo-solid"
  | "redo"
  | "redo-solid"
  | "copy"
  | "copy-solid"
  | "paste"
  | "cut"
  | "object-ungroup"
  | "trash"
  | "trash-solid"
  | "remove-format"
  | "clipboard"
  | "search-plus"
  | "search-minus"
  | "search-light"
  | "save"
  | "slash"
  | "empty"
  | "cloud-upload-alt"
  | "folder-open-solid"
  | "tint"
  | "warp-arc"
  | "warp-flag"
  | "warp-bulge"
  | "warp-arc-upper"
  | "warp-pit-upper"
  | "warp-arc-lower"
  | "warp-pit-lower"
  | "warp-fish"
  | "warp-squeeze"
  | "warp-mug"
  | "mesh"
  | "crop"
  | "fill-image"
  | "fit-image"
  | "vertical-align-bottom-baseline"
  | "vertical-align-center-baseline"
  | "vertical-align-center"
  | "vertical-align-top"
  | "vertical-align-bottom"
  | "warning"
  | "effects"
  | "robot"
  | "microchip"
  | "record"
  | "play"
  | "running"
  | "rotator"
  | "lock-closed"
  | "lock-open"
  | "lock-closed-solid"
  | "user-lock-closed"
  | "user-lock-opened"
  | "link"
  | "stroke-cap-round"
  | "stroke-cap-projecting"
  | "stroke-cap-butt"
  | "stroke-align-center"
  | "stroke-align-inside"
  | "stroke-align-outside"
  | "stroke-join-miter"
  | "stroke-join-round"
  | "stroke-join-bevel"
  | "wrap-both-sides"
  | "no-wrap"
  | "printess-wand"
  | "print-solid"
  | "shopping-cart"
  | "shopping-cart-solid"
  | "shopping-cart-add"
  | "folder-plus"
  | "eye-solid"
  | "eye-solid-slash"
  | "font"
  | "send-back"
  | "send-backward"
  | "bring-front"
  | "bring-forward"
  | "distort"
  | "list-ul"
  | "ellipsis-v"
  | "sun-light"
  | "adjust"
  | "scroll-old"
  | "align-top"
  | "align-middle"
  | "align-bottom"
  | "align-left"
  | "align-center"
  | "align-right"
  | "space-vertical-around"
  | "space-vertical-between"
  | "space-horizontal-around"
  | "space-horizontal-between"
  | "layer-group"
  | "ruler"
  | "layout-snippet"
  | "layout-snippet-invers"
  | "group-snippet"
  | "group-snippet-invers"
  | "primary-doc"
  | "primary-doc-invers"
  | "preview-doc"
  | "preview-doc-invers"
  | "production-doc"
  | "production-doc-invers"
  | "facebook-round"
  | "clock-solid"
  | "page-plus-solid"
  | "user-friends-solid"
  | "opacity"
  | "file-invoice"
  | "help"
  | "triangle-solid"
  | "pin-solid"
  | "pin"
  | "angle-right"
  | "angle-down"
  | "sync"
  | "mirror-x"
  | "mirror-y"
  | "angle-up-light"
  | "angle-down-light"
  | "chevron-up-light"
  | "chevron-down-light"
  | "sign-in-light"
  | "share-light"
  | "share-solid"
  | "reply-light"
  | "reply-solid"
  | "undo-arrow"
  | "redo-arrow"
  | "rotate"
  | "primary"
  | "back"
  | "angle-double-right"
  | "angle-double-left"
  | "arrow-to-right"
  | "arrow-to-left"
  | "distribute-image"
  | "minus-square";