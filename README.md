# Rollup and SystemJS POC

Since some libraries are using rollup to bundle, i wanted to give it a try. It seamed cool, since it bundles to diferent types of modules, like UMD, ESM and etc...
And SystemJS is famous a es module loader. I never used it, but testing it would be nice.

## Considerations

### Rollup Configuration

I don't know if I got too much used with Parcel, but a config file is just too boring to do. I also had a problem with UMD file and I had to put a plugin to solve it.
Seeing the bright side, it's nice that we can bundle multiples types of modules, this make libs reusable accross the js enviroments.

### Package Name Map

This is a really nice feature. Just make a json with all the packages you need and systemjs will get them for you. But I don't know why, I couldn't get it to work. I had to ```System.import()``` hybrids lib so I could use the component, and it doesn't look good. Since SystemJS 2.0 just came out, I'll try at a later time.

### System.import to import the libs

I know that SystemJs is really close to the real spec, but using a lib just doesn't look good to me. I hope the Package Name Map becomes a native spec real soom, it will be better to use only ```<script type="module"></script>``` to load.

### SystemJS size
It's really a tiny lib, so it won't impact application performance. Use it without trouble.