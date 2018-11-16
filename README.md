# computer vision tests for facilitating non-text-based search and exploration

playing around with some computer vision and machine learning algorithms to hopefully reduce dependency on text-based searches of the DPLA corpus.

tests done in the [“world war i posters” search](https://dp.la/search?q=world+war+i+poster) in DPLA which contains about 2,300 images from different sources. a list of ids and urls can be found in [`data/images.ndjson`](data/images.ndjson)

that query was chosen for the visual quality of the items (ideally posters, assuming the proper metadata exists in the records) and also relevant to 2018 being the 100 year anniversary of the end of world war i.

## download the thumbnails

use the [`data/download.sh`](data/download.sh) script to get all the thumbnails. the script requires [jq](https://stedolan.github.io/jq/)

## [grid viewer demo](https://mgiraldo.github.io/cv-tests/output-ml4a/viewer-grid.html)

browse the posters in a grid viewer organized by visual similarity in a layout inspired by google images although this one makes use of css grid. works best on larger screens.

uses [localForage](https://localforage.github.io/localForage/) for list management.

## [serendipity viewer demo](https://mgiraldo.github.io/cv-tests/output-ml4a/viewer-serendipity.html)

this viewer aims to allow serendipitous exploration of the posters. it chooses a random image from the set followed by other images from very similar to very dissimilar. it is somewhat inspired by the ios photos application, where the swipe-up gesture in an image displays related photos.

## [reverse image search service code](https://github.com/mgiraldo/cv-tests/tree/master/reverse)

skeleton service that contains the trained model and can be used to find the similarity of any user-submitted image to the images in the set. more information is provided in that folder's README.

## see also

this code borrows extensively from:

* [Gene Kogan's ML for artists guides](https://ml4a.github.io/guides/)
* [YOLO object detection](https://pjreddie.com/darknet/yolo/)
* [Gene Kogan's reverse image search guide](https://github.com/ml4a/ml4a-guides/blob/e3fff22bdd2b42543d32aadecb39038bcf5aca15/notebooks/image-search.ipynb)
* [Gene Kogan's t-SNE clustering guide](https://github.com/ml4a/ml4a-guides/blob/master/notebooks/image-tsne.ipynb)
* [Mario Klingemann's Raster Fairy](https://github.com/Quasimondo/RasterFairy)
