# tests-dagger

Several examples to test [dagger.io](https://dagger.io/). Check out the [presentation](presentation.pdf) for a deeper understanding of dagger.

## Basic

A dead-simple nodejs application. 

To run:

```
cd basic
make init
make all
```

## Helm

A helm chart that allows us to check its output against different versions of the Kubernetes api (using kubeconform). 

To run:

```
cd chart
make init
make all
```
