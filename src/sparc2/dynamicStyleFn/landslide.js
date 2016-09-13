module.exports = function(f, state, map_config, options)
{
  var fl = geodash.api.getFeatureLayer("popatrisk");
  var style = {};
  var filters = state["filters"]["popatrisk"];
  var popatrisk_range = filters["popatrisk_range"];
  var ldi_range = filters["ldi_range"];
  var ldi = f.properties.ldi;
  var erosion_propensity_range = filters["erosion_propensity_range"];
  var erosion_propensity = f.properties.erosion_propensity;
  var landcover_delta_negative_range = filters["landcover_delta_negative_range"];
  var landcover_delta_negative = f.properties.delta_negative;

  var value = sparc.calc.popatrisk(
    'landslide',
    geodash.api.normalize_feature(f),
    state,
    options.filters);

  if(
    value >= popatrisk_range[0] && value <= popatrisk_range[1] &&
    (ldi == undefined || (ldi >= ldi_range[0] && ldi <= ldi_range[1])) &&
    (erosion_propensity == undefined || (erosion_propensity >= erosion_propensity_range[0] && erosion_propensity <= erosion_propensity_range[1])) &&
    (landcover_delta_negative == undefined || (landcover_delta_negative >= landcover_delta_negative_range[0] && landcover_delta_negative <= landcover_delta_negative_range[1]))
  )
  {
      var colors = fl["cartography"][0]["colors"]["ramp"];
      var breakpoints = geodash.breakpoints[options["breakpoints"]];
      var color = undefined;
      for(var i = 0; i < breakpoints.length -1; i++)
      {
        if(
          (value == breakpoints[i] && value == breakpoints[i+1]) ||
          (value >= breakpoints[i] && value < breakpoints[i+1])
        )
        {
          color = colors[i];
          break;
        }
      }
      style["fillColor"] = (color == undefined) ? colors[colors.length-1] : color;
  }
  else
  {
    style["opacity"] = 0;
    style["fillOpacity"] = 0;
  }
  return style;
};
