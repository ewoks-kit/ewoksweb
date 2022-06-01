import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Grid,
} from '@material-ui/core';
import SignUp from '../layout/SignUp';

export default function EwoksUiInfo(props) {
  const infoCategories = [
    {
      summary: 'Create a graph',
      details: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
    eget.`,
    },
    {
      summary: 'Nodes editing details',
      details: `
      <section id="node-attributes">
<h3>Node attributes<a class="headerlink" href="https://ewokscore.readthedocs.io/en/latest/definitions.html#node-attributes" title="Permalink to this headline">¶</a></h3>
<NotListedLocationIcon></NotListedLocationIcon>
<ul>
<li><p><em>id</em>: node identifier unique to the graph</p></li>
<li><p><em>label</em> (optional): non-unique label to be used when identifying a node for human consumption</p></li>
<li><p><em>task_identifier</em>: specifies the unit of execution</p></li>
<li><p><em>task_type</em>: defines the meaning of <em>task_identifier</em> and can have of these values:</p>
<ul class="simple">
<li><p><em>class</em>: <em>task_identifier</em> is the full qualifier name of a task class (statically defined)</p></li>
<li><p><em>generated</em>: <em>task_identifier</em> is an argument that is used by <em>task_generator</em> to generate
a task at runtime</p></li>
<li><p><em>method</em>: <em>task_identifier</em> is the full qualifier name of a function</p></li>
<li><p><em>graph</em>: <em>task_identifier</em> is the representation of another graph (e.g. json file name)</p></li>
<li><p><em>ppfmethod</em>: <em>task_identifier</em> is the full qualifier name of a <em>pypushflow</em> function (special input/output convention)</p></li>
<li><p><em>ppfport</em>: special <em>ppfmethod</em> which is the <em>identify mapping</em>. <em>task_identifier</em> should not be specified.</p></li>
<li><p><em>script</em>: <em>task_identifier</em> is the absolute path of a python or shell script</p></li>
</ul>
</li>
<li><p><em>task_generator</em> (optional): the full qualifier name of a method that generates a task at runtime
based on <em>task_identifier</em>. Only used when <em>task_type</em> is <em>generated</em>.</p></li>
<li><dl>
<dt><em>default_inputs</em> (optional): default input arguments (used when not provided by the output of other tasks). For example:</dt><dd><div class="highlight-json notranslate"><div class="highlight"><pre><span></span><span class="p">{</span><span class="w"></span>
<span class="w">    </span><span class="nt">"default_inputs"</span><span class="p">:</span><span class="w"> </span><span class="p">[{</span><span class="nt">"name"</span><span class="p">:</span><span class="s2">"a"</span><span class="p">,</span><span class="w"> </span><span class="nt">"value"</span><span class="p">:</span><span class="mi">1</span><span class="p">}]</span><span class="w"></span>
<span class="p">}</span><span class="w"></span>
</pre></div>
</div>
</dd>
</dl>
</li>
<li><p><em>inputs_complete</em> (optional): set to <cite>True</cite> when the default input covers all required input
(used for method and script as the required inputs are unknown)</p></li>
<li><p><em>conditions_else_value</em> (optional): value used in conditional links to indicate the <em>else</em> value (Default: <cite>None</cite>)</p></li>
<li><p><em>default_error_node</em> (optional): when set to <cite>True</cite> all nodes without error handler will be linked to this node.</p></li>
<li><p><em>default_error_attributes</em> (optional): when <cite>default_error_node=True</cite> this dictionary is used as attributes for the
error handler links. The default is <cite>{“map_all_data”: True}</cite>. The link attribute <cite>“on_error”</cite> is forced to be <cite>True</cite>.</p></li>
</ul>
</section>
    `,
    },
    { summary: 'Nodes style editing', details: 'Id' },
    { summary: 'Links editing details', details: 'Id' },
    { summary: 'Clone Node, Graph', details: 'Id' },
    { summary: 'Manage Icons', details: 'Id' },
    { summary: 'Manage Tasks', details: 'Id' },
    { summary: 'other', details: 'Id' },
  ];

  const closeDialog = () => {
    console.log(props);
    props.closeDialog();
  };

  return (
    <div className="infoAccordion">
      <Grid
        container
        spacing={5}
        direction="row"
        // justifyContent="flex-start"
        alignItems="center"
      >
        <Grid item xs={12} sm={12} md={12} lg={7}>
          <SignUp handleCloseDialog={closeDialog} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={5}>
          <h2 style={{ color: '#3f51b5' }}>Using Ewoks-UI</h2>
          {infoCategories.map(({ summary, details }) => (
            <Accordion key={summary}>
              <AccordionSummary
                expandIcon={<OpenInBrowser />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{summary}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {/* eslint-disable-next-line react/no-danger */}
                  <span dangerouslySetInnerHTML={{ __html: details }} />
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}
